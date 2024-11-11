import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Retrieve the token from cookies
  const token = request.cookies.get('authToken')?.value

  // Redirect to login if token is not found
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Call the API to verify the token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verifyrole`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    // If the token is valid, get the role from the response
    if (res.ok) {
      const data = await res.json()
      const userRole = data.role

      // Restrict access based on user role and request URL
      const url = request.nextUrl.pathname

      if (url.startsWith('/secure') && userRole !== 'Admin') {
        // Redirect non-admin users away from admin routes
        return NextResponse.redirect(new URL('/404', request.url))
      }

      // Continue to the requested page for all other cases
      return NextResponse.next()
    } else {
      // If the token is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    // Redirect to login on error
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Matcher to specify protected routes
export const config = {
    matcher: ['/dashboard/:path*', '/secure/:path*'],
  }
