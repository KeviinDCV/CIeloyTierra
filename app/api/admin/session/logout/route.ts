import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/adminSessionAPI'

export async function POST(request: NextRequest) {
  try {
    const { deviceId } = await request.json()

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID requerido' },
        { status: 400 }
      )
    }

    // Delete session
    await deleteSession(deviceId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in logout:', error)
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

