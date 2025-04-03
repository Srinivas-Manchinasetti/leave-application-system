"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOutIcon, UsersIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { AdminLeaveRequestsTable } from "@/components/admin-leave-requests-table"
import { AdminEmployeesTable } from "@/components/admin-employees-table"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the stats from your backend
    // This is a simplified example
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setStats({
        totalEmployees: 24,
        pendingRequests: 5,
        approvedRequests: 18,
        rejectedRequests: 3,
      })
      setLoading(false)
    }, 1000)

    // fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Administrator</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <CardDescription>Registered in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{stats.totalEmployees}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <CardDescription>Awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-2xl font-bold">{stats.pendingRequests}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{stats.approvedRequests}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected Leaves</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{stats.rejectedRequests}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="mb-6">
            <TabsTrigger value="requests">Leave Requests</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
          </TabsList>
          <TabsContent value="requests">
            <AdminLeaveRequestsTable />
          </TabsContent>
          <TabsContent value="employees">
            <AdminEmployeesTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

