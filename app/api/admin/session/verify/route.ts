import { NextRequest, NextResponse } from 'next/server'
import { verifySession, hasActiveSession } from '@/lib/adminSessionAPI'

export async function POST(request: NextRequest) {
  try {
    const { deviceId, token } = await request.json()

    if (!deviceId || !token) {
      return NextResponse.json(
        { error: 'Device ID y token requeridos' },
        { status: 400 }
      )
    }

    // Verify session
    const isValid = await verifySession(deviceId, token)

    return NextResponse.json({ 
      valid: isValid 
    })
  } catch (error) {
    console.error('Error verifying session:', error)
    return NextResponse.json(
      { error: 'Error al verificar sesión' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if there's any active session
    const hasActive = await hasActiveSession()

    return NextResponse.json({ 
      hasActiveSession: hasActive 
    })
  } catch (error) {
    console.error('Error checking active session:', error)
    return NextResponse.json(
      { error: 'Error al verificar sesión activa' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

