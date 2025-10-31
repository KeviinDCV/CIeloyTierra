import { NextRequest, NextResponse } from 'next/server'
import { hasActiveSession, createSession, generateToken } from '@/lib/adminSessionAPI'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, deviceId } = body

    // Validate required fields
    if (!username || !password || !deviceId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verify credentials
    if (username !== 'admin' || password !== 'cieloytierra2024') {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken()

    // Create session (this will delete ALL existing sessions and create a new one)
    // This ensures only ONE session can be active at a time
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

