"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckIcon, XIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type LeaveRequest = {
  id: string
  employeeName: string
  employeeEmail: string
  type: string
  startDate: string
  endDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  appliedOn: string
}

export function AdminLeaveRequestsTable() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load leave requests from localStorage
    const loadLeaveRequests = () => {
      try {
        const storedRequests = localStorage.getItem("adminLeaveRequests")
        if (storedRequests) {
          setLeaveRequests(JSON.parse(storedRequests))
        } else {
          // If no stored requests, use default mock data
          const defaultRequests = [
            {
              id: "1",
              employeeName: "John Doe",
              employeeEmail: "john@example.com",
              type: "Annual Leave",
              startDate: "2024-04-10",
              endDate: "2024-04-15",
              reason: "Family vacation",
              status: "pending",
              appliedOn: "2024-03-25",
            },
            {
              id: "2",
              employeeName: "Jane Smith",
              employeeEmail: "jane@example.com",
              type: "Sick Leave",
              startDate: "2024-04-05",
              endDate: "2024-04-06",
              reason: "Doctor's appointment",
              status: "pending",
              appliedOn: "2024-04-04",
            },
            {
              id: "3",
              employeeName: "Mike Johnson",
              employeeEmail: "mike@example.com",
              type: "Personal Leave",
              startDate: "2024-04-20",
              endDate: "2024-04-20",
              reason: "Personal matters",
              status: "pending",
              appliedOn: "2024-04-01",
            },
            {
              id: "4",
              employeeName: "Sarah Williams",
              employeeEmail: "sarah@example.com",
              type: "Unpaid Leave",
              startDate: "2024-05-01",
              endDate: "2024-05-10",
              reason: "Extended personal trip",
              status: "pending",
              appliedOn: "2024-03-15",
            },
            {
              id: "5",
              employeeName: "David Brown",
              employeeEmail: "david@example.com",
              type: "Annual Leave",
              startDate: "2024-06-15",
              endDate: "2024-06-30",
              reason: "Summer vacation",
              status: "pending",
              appliedOn: "2024-03-30",
            },
          ]
          setLeaveRequests(defaultRequests)
          // Save default data to localStorage
          localStorage.setItem("adminLeaveRequests", JSON.stringify(defaultRequests))
        }
      } catch (error) {
        console.error("Failed to load admin leave requests", error)
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

  const handleApprove = async (id: string) => {
    try {
      // Update admin's leave requests
      const updatedAdminRequests = leaveRequests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request,
      )
      setLeaveRequests(updatedAdminRequests)
      localStorage.setItem("adminLeaveRequests", JSON.stringify(updatedAdminRequests))

      // Also update the user's leave history
      const userLeaveHistory = JSON.parse(localStorage.getItem("userLeaveHistory") || "[]")
      const updatedUserHistory = userLeaveHistory.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request,
      )
      localStorage.setItem("userLeaveHistory", JSON.stringify(updatedUserHistory))

      // Trigger storage event to update other components
      window.dispatchEvent(new Event("storage"))

      toast({
        title: "Leave request approved",
        description: "The leave request has been approved successfully.",
      })
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was a problem approving the leave request.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      // Update admin's leave requests
      const updatedAdminRequests = leaveRequests.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request,
      )
      setLeaveRequests(updatedAdminRequests)
      localStorage.setItem("adminLeaveRequests", JSON.stringify(updatedAdminRequests))

      // Also update the user's leave history
      const userLeaveHistory = JSON.parse(localStorage.getItem("userLeaveHistory") || "[]")
      const updatedUserHistory = userLeaveHistory.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request,
      )
      localStorage.setItem("userLeaveHistory", JSON.stringify(updatedUserHistory))

      // Trigger storage event to update other components
      window.dispatchEvent(new Event("storage"))

      toast({
        title: "Leave request rejected",
        description: "The leave request has been rejected.",
      })
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was a problem rejecting the leave request.",
        variant: "destructive",
      })
    }
  }

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
    return <p>Loading leave requests...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Requests</CardTitle>
        <CardDescription>Manage employee leave requests</CardDescription>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No pending leave requests</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.employeeName}</p>
                      <p className="text-sm text-muted-foreground">{request.employeeEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <div>
                      <p>{request.startDate}</p>
                      <p>to</p>
                      <p>{request.endDate}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.appliedOn}</TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-green-600"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() => handleReject(request.id)}
                        >
                          <XIcon className="h-4 w-4" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

