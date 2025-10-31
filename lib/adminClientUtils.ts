// Client-side utilities for admin session management

// Generate or retrieve device ID
export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  
  let deviceId = localStorage.getItem('adminDeviceId')
  if (!deviceId) {
    // Generate a unique ID using crypto.randomUUID if available, otherwise use a fallback
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        deviceId = crypto.randomUUID()
      } else {
        // Fallback: generate a unique ID using timestamp and random string
        deviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`
      }
      localStorage.setItem('adminDeviceId', deviceId)
    } catch (error) {
      console.error('Error generating device ID:', error)
      // Fallback ID generation
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem('adminDeviceId', deviceId)
    }
  }
  return deviceId
}

// Get admin token from localStorage
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('adminToken')
}

// Set admin token in localStorage
export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem('adminToken', token)
}

// Remove admin token from localStorage
export function removeAdminToken(): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem('adminToken')
}

// Get device ID from localStorage (for API calls)
export function getDeviceIdForAPI(): string {
  return getDeviceId()
}

