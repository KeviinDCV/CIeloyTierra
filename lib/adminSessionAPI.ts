import { supabase } from './db'

// Note: Device ID generation should be done client-side using adminClientUtils.ts
// This function is only for server-side use

// Generate a secure token (server-side only)
export function generateToken(): string {
  if (typeof window === 'undefined') {
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
  }
  // Client-side fallback (should not be used, but just in case)
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`
}

// Check if there's an active session (excluding current device)
export async function hasActiveSession(excludeDeviceId?: string): Promise<boolean> {
  try {
    const now = new Date().toISOString()
    
    let query = supabase
      .from('admin_sessions')
      .select('id')
      .gt('expires_at', now)
      .limit(1)
    
    if (excludeDeviceId) {
      query = query.neq('device_id', excludeDeviceId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return (data?.length || 0) > 0
  } catch (error) {
    console.error('Error checking active session:', error)
    return false
  }
}

// Create a new session
export async function createSession(deviceId: string, token: string): Promise<void> {
  try {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days expiration
    
    // IMPORTANT: Delete ALL existing sessions first (only one session allowed at a time)
    const { error: deleteError } = await supabase
      .from('admin_sessions')
      .delete()
      .neq('id', 0) // Delete all rows
    
    if (deleteError) throw deleteError
    
    // Create new session (this will be the only active session)
    const { error: insertError } = await supabase
      .from('admin_sessions')
      .insert({
        device_id: deviceId,
        token: token,
        expires_at: expiresAt.toISOString()
      })
    
    if (insertError) throw insertError
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

// Verify token and device match
export async function verifySession(deviceId: string, token: string): Promise<boolean> {
  try {
    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('id')
      .eq('device_id', deviceId)
      .eq('token', token)
      .gt('expires_at', now)
      .limit(1)
    
    if (error) throw error
    return (data?.length || 0) > 0
  } catch (error) {
    console.error('Error verifying session:', error)
    return false
  }
}

// Delete session
export async function deleteSession(deviceId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('device_id', deviceId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}

// Delete all sessions (for logout from all devices)
export async function deleteAllSessions(): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .neq('id', 0) // Delete all rows
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting all sessions:', error)
    throw error
  }
}

