"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, LogOutIcon } from "lucide-react"
import { LeaveApplicationForm } from "@/components/leave-application-form"
import { LeaveHistoryTable } from "@/components/leave-history-table"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(tabParam === "history" ? "history" : "apply")

  useEffect(() => {
    // In a real app, you would fetch the user data from your backend
    // This is a simplified example
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch user data", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setUser({
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        leaveBalance: {
          annual: 15,
          sick: 10,
          personal: 5,
        },
      })
      setLoading(false)
    }, 1000)

    // fetchUser()
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
          <h1 className="text-xl font-semibold">Leave Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
              <CardDescription>Available balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{user?.leaveBalance.annual} days</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
              <CardDescription>Available balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{user?.leaveBalance.sick} days</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Personal Leave</CardTitle>
              <CardDescription>Available balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">{user?.leaveBalance.personal} days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
            <TabsTrigger value="history">Leave History</TabsTrigger>
          </TabsList>
          <TabsContent value="apply">
            <LeaveApplicationForm />
          </TabsContent>
          <TabsContent value="history">
            <LeaveHistoryTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

