import { NextRequest, NextResponse } from 'next/server'
import { hasActiveSession, createSession, generateToken } from '@/lib/adminSessionAPI'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, deviceId } = body

    // Debug logging (remove in production)
    console.log('Login attempt:', { username, password: password ? '***' : 'missing', deviceId })

    // Validate required fields
    if (!username || !password || !deviceId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verify credentials
    if (username !== 'admin' || password !== 'cieloytierra2024') {
      console.log('Invalid credentials:', { username, receivedPassword: password ? '***' : 'missing' })
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Check if there's already an active session (excluding current device)
    const hasActive = await hasActiveSession(deviceId)
    if (hasActive) {
      return NextResponse.json(
        { error: 'Ya hay una sesión activa en otro dispositivo. Por favor, cierra sesión desde ese dispositivo primero.' },
        { status: 403 }
      )
    }

    // Generate token
    const token = generateToken()

    // Create session
    await createSession(deviceId, token)

    return NextResponse.json({ 
      success: true, 
      token,
      deviceId 
    })
  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

