"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type Employee = {
  id: string
  name: string
  email: string
  department: string
  position: string
  joinDate: string
  leaveBalance: {
    annual: number
    sick: number
    personal: number
  }
}

export function AdminEmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the employees from your backend
    // This is a simplified example
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/admin/employees")
        if (response.ok) {
          const data = await response.json()
          setEmployees(data)
          setFilteredEmployees(data)
        }
      } catch (error) {
        console.error("Failed to fetch employees", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockEmployees = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          department: "Engineering",
          position: "Senior Developer",
          joinDate: "2020-05-15",
          leaveBalance: {
            annual: 15,
            sick: 10,
            personal: 5,
          },
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          department: "Marketing",
          position: "Marketing Manager",
          joinDate: "2019-03-10",
          leaveBalance: {
            annual: 18,
            sick: 10,
            personal: 5,
          },
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike@example.com",
          department: "Sales",
          position: "Sales Representative",
          joinDate: "2021-01-20",
          leaveBalance: {
            annual: 12,
            sick: 10,
            personal: 5,
          },
        },
        {
          id: "4",
          name: "Sarah Williams",
          email: "sarah@example.com",
          department: "Human Resources",
          position: "HR Specialist",
          joinDate: "2018-11-05",
          leaveBalance: {
            annual: 20,
            sick: 10,
            personal: 5,
          },
        },
        {
          id: "5",
          name: "David Brown",
          email: "david@example.com",
          department: "Engineering",
          position: "Frontend Developer",
          joinDate: "2022-02-15",
          leaveBalance: {
            annual: 10,
            sick: 10,
            personal: 5,
          },
        },
      ]
      setEmployees(mockEmployees)
      setFilteredEmployees(mockEmployees)
      setLoading(false)
    }, 1000)

    // fetchEmployees()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          employee.department.toLowerCase().includes(query) ||
          employee.position.toLowerCase().includes(query),
      )
      setFilteredEmployees(filtered)
    }
  }, [searchQuery, employees])

  if (loading) {
    return <p>Loading employees...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employees</CardTitle>
        <CardDescription>Manage employee information and leave balances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredEmployees.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No employees found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Annual Leave</TableHead>
                <TableHead>Sick Leave</TableHead>
                <TableHead>Personal Leave</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>{employee.leaveBalance.annual} days</TableCell>
                  <TableCell>{employee.leaveBalance.sick} days</TableCell>
                  <TableCell>{employee.leaveBalance.personal} days</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

