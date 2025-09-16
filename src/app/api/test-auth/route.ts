import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test if the WordPress JWT API endpoint is accessible
    const response = await fetch('https://roynaldkalele.com/wp-json/jwt-auth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test',
        password: 'test'
      })
    })

    const responseData = await response.text()

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test auth endpoint',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}