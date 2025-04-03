"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type LeaveRequest = {
  id: string
  type: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedOn: string
}

export function LeaveHistoryTable() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load leave requests from localStorage
    const loadLeaveRequests = () => {
      try {
        const storedRequests = localStorage.getItem("userLeaveHistory")
        if (storedRequests) {
          setLeaveRequests(JSON.parse(storedRequests))
        } else {
          // If no stored requests, use default mock data
          setLeaveRequests([
            {
              id: "1",
              type: "Annual Leave",
              startDate: "2023-12-24",
              endDate: "2023-12-31",
              reason: "Year-end vacation",
              status: "approved",
              appliedOn: "2023-11-15",
            },
            {
              id: "2",
              type: "Sick Leave",
              startDate: "2023-10-10",
              endDate: "2023-10-12",
              reason: "Flu",
              status: "approved",
              appliedOn: "2023-10-10",
            },
            {
              id: "3",
              type: "Personal Leave",
              startDate: "2024-02-15",
              endDate: "2024-02-15",
              reason: "Family event",
              status: "pending",
              appliedOn: "2024-01-25",
            },
            {
              id: "4",
              type: "Unpaid Leave",
              startDate: "2023-09-05",
              endDate: "2023-09-10",
              reason: "Personal travel",
              status: "rejected",
              appliedOn: "2023-08-20",
            },
          ])
          // Save default data to localStorage
          localStorage.setItem("userLeaveHistory", JSON.stringify(leaveRequests))
        }
      } catch (error) {
        console.error("Failed to load leave history", error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaveRequests()

    // Add event listener to refresh data when localStorage changes
    window.addEventListener("storage", loadLeaveRequests)

    return () => {
      window.removeEventListener("storage", loadLeaveRequests)
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return <p>Loading leave history...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave History</CardTitle>
        <CardDescription>View all your leave requests and their status</CardDescription>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No leave requests found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.appliedOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

