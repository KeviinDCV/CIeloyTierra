import { sql } from './db'

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
    const now = new Date()
    const sessions = await sql`
      SELECT id FROM admin_sessions 
      WHERE expires_at > ${now}
      ${excludeDeviceId ? sql`AND device_id != ${excludeDeviceId}` : sql``}
      LIMIT 1
    `
    return sessions.length > 0
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
    
    // Delete any existing session for this device
    await sql`DELETE FROM admin_sessions WHERE device_id = ${deviceId}`
    
    // Delete any expired sessions
    const now = new Date()
    await sql`DELETE FROM admin_sessions WHERE expires_at <= ${now}`
    
    // Create new session
    await sql`
      INSERT INTO admin_sessions (device_id, token, expires_at)
      VALUES (${deviceId}, ${token}, ${expiresAt})
    `
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

// Verify token and device match
export async function verifySession(deviceId: string, token: string): Promise<boolean> {
  try {
    const now = new Date()
    const sessions = await sql`
      SELECT id FROM admin_sessions 
      WHERE device_id = ${deviceId} 
      AND token = ${token}
      AND expires_at > ${now}
      LIMIT 1
    `
    return sessions.length > 0
  } catch (error) {
    console.error('Error verifying session:', error)
    return false
  }
}

// Delete session
export async function deleteSession(deviceId: string): Promise<void> {
  try {
    await sql`DELETE FROM admin_sessions WHERE device_id = ${deviceId}`
  } catch (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}

// Delete all sessions (for logout from all devices)
export async function deleteAllSessions(): Promise<void> {
  try {
    await sql`DELETE FROM admin_sessions`
  } catch (error) {
    console.error('Error deleting all sessions:', error)
    throw error
  }
}

