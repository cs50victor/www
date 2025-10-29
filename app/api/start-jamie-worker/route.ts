import { NextRequest, NextResponse } from 'next/server'

const JAMIE_WORKER_API_KEY = process.env.JAMIE_WORKER_API_KEY

if (!JAMIE_WORKER_API_KEY){
  throw new Error('JAMIE_WORKER_API_KEY is not defined')
}

export async function POST(req: NextRequest) {
  try {
    const { roomName } = await req.json()

    if (!roomName) {
      return NextResponse.json(
        { error: 'roomName is required' },
        { status: 400 }
      )
    }

    const workerEndpoint = process.env.JAMIE_WORKER_ENDPOINT ?? "http://127.0.0.1:9000/start"

    if (!workerEndpoint) {
      return NextResponse.json(
        { error: 'Jamie worker endpoint not configured' },
        { status: 500 }
      )
    }

    console.log('Starting jamie worker... with endpoint:', workerEndpoint)
    const response = await fetch(workerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JAMIE_WORKER_API_KEY}`
      },
      body: JSON.stringify({ input: { room_name: roomName } }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Server error, please contact me' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error starting jamie worker:', error)
    return NextResponse.json(
      { error: 'Server error, please contact me' },
      { status: 500 }
    )
  }
}
