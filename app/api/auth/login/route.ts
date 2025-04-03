import { NextResponse } from "next/server"

// This is a mock implementation for demonstration purposes
// In a real application, you would validate credentials against a database
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Mock user data - in a real app, you would fetch this from a database
    const users = [
      { id: "1", email: "admin@example.com", password: "admin123", name: "Admin User", role: "admin" },
      { id: "2", email: "user@example.com", password: "user123", name: "Regular User", role: "user" },
    ]

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you would set up a session or JWT token here
    // For this demo, we'll just return the user info
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

