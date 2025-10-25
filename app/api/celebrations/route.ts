import { NextResponse } from 'next/server'
import { fetchCelebrations, addCelebration } from '@/lib/celebrationsAPI'

export async function GET() {
  try {
    const celebrations = await fetchCelebrations()
    return NextResponse.json(celebrations)
  } catch (error) {
    console.error('Error fetching celebrations:', error)
    return NextResponse.json({ error: 'Failed to fetch celebrations' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newCelebration = await addCelebration(body)
    return NextResponse.json(newCelebration)
  } catch (error) {
    console.error('Error adding celebration:', error)
    return NextResponse.json({ error: 'Failed to add celebration' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
