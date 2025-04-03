import { NextResponse } from "next/server"

// This is a mock implementation for demonstration purposes
// In a real application, you would store leave requests in a database
export async function POST(request: Request) {
  try {
    const { leaveType, startDate, endDate, reason } = await request.json()

    // Validate input
    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Validate the user is authenticated
    // 2. Check if they have enough leave balance
    // 3. Store the leave request in a database

    // Mock successful leave application
    return NextResponse.json({
      success: true,
      message: "Leave application submitted successfully",
      leaveRequest: {
        id: Math.random().toString(36).substring(2, 9),
        leaveType,
        startDate,
        endDate,
        reason,
        status: "pending",
        appliedOn: new Date().toISOString().split("T")[0],
      },
    })
  } catch (error) {
    console.error("Leave application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

