"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface Student {
  _id: string
  name: string
  institute: string
  role: "STUDENT" | "FACULTY"
  instituteId: string
  mobile: string
  appliedOn: string
  idCardFront: string
  idCardBack: string
  createdAt: string
}

interface Vendor {
  _id: string
  businessName: string
  contactName: string
  businessCategory: string
  mobile: string
  appliedOn: string
  gst: string
  pan: string
  createdAt: string
}

export default function AdminDashboard() {
  const [pendingVerifications, setPendingVerifications] = useState<Student[]>([])
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL

  // Fetch unverified users and vendors
  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/users`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()
        if (data.success) {
          setPendingVerifications(data.users)
        } else {
          console.error("AdminDashboard - Failed to fetch users:", data.message)
          setError(data.message || "Failed to fetch users")
        }
      } catch (err) {
        console.error("AdminDashboard - Error fetching users:", err)
        setError("Error fetching users")
      }
    }

    const fetchUnverifiedVendors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/vendor/vendors`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()
        if (data.success) {
          setPendingVendors(data.vendors)
        } else {
          console.error("AdminDashboard - Failed to fetch vendors:", data.message)
          setError(data.message || "Failed to fetch vendors")
        }
      } catch (err) {
        console.error("AdminDashboard - Error fetching vendors:", err)
        setError("Error fetching vendors")
      }
    }

    fetchUnverifiedUsers()
    fetchUnverifiedVendors()
  }, [BASE_URL])

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsStudentDialogOpen(true)
  }

  const viewVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsVendorDialogOpen(true)
  }

  const approveUser = async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/users/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true }),
      })
      const data = await response.json()
      if (data.success) {
        setPendingVerifications((prev) => prev.filter((user) => user._id !== userId))
        setIsStudentDialogOpen(false)
      } else {
        console.error("AdminDashboard - Failed to approve user:", data.message)
        setError(data.message || "Failed to approve user")
      }
    } catch (err) {
      console.error("AdminDashboard - Error approving user:", err)
      setError("Error approving user")
    }
  }

  const rejectUser = async (userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (data.success) {
        setPendingVerifications((prev) => prev.filter((user) => user._id !== userId))
        setIsStudentDialogOpen(false)
      } else {
        console.error("AdminDashboard - Failed to reject user:", data.message)
        setError(data.message || "Failed to reject user")
      }
    } catch (err) {
      console.error("AdminDashboard - Error rejecting user:", err)
      setError("Error rejecting user")
    }
  }

  const approveVendor = async (vendorId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/vendor/vendors/${vendorId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: true }),
      })
      const data = await response.json()
      if (data.success) {
        setPendingVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId))
        setIsVendorDialogOpen(false)
      } else {
        console.error("AdminDashboard - Failed to approve vendor:", data.message)
        setError(data.message || "Failed to approve vendor")
      }
    } catch (err) {
      console.error("AdminDashboard - Error approving vendor:", err)
      setError("Error approving vendor")
    }
  }

  const rejectVendor = async (vendorId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/vendor/vendors/${vendorId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (data.success) {
        setPendingVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId))
        setIsVendorDialogOpen(false)
      } else {
        console.error("AdminDashboard - Failed to reject vendor:", data.message)
        setError(data.message || "Failed to reject vendor")
      }
    } catch (err) {
      console.error("AdminDashboard - Error rejecting vendor:", err)
      setError("Error rejecting vendor")
    }
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-card border-r h-full">
        <div className="p-4 border-b">
          <h2 className="font-bold text-xl">Admin Dashboard</h2>
        </div>
        <div className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
            >
              <Users className="mr-3 h-5 w-5" />
              Verifications
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Package className="mr-3 h-5 w-5" />
              Orders
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/auth/login">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-card border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center md:hidden">
              <Button variant="outline" size="icon">
                <span className="sr-only">Open menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <h2 className="ml-2 font-semibold">Admin Dashboard</h2>
            </div>
            <div className="flex-1 flex justify-center px-2 md:ml-6 md:justify-end">
              <div className="max-w-lg w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input type="search" placeholder="Search..." className="pl-10 w-full md:w-60 lg:w-80" />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 dx-icon" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      A
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
                    <h3 className="text-2xl font-bold mt-1">{pendingVerifications.length + pendingVendors.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Products</p>
                    <h3 className="text-2xl font-bold mt-1">12</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <h3 className="text-2xl font-bold mt-1">1,254</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">₹1,23,456</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Verification Requests</CardTitle>
              <CardDescription>Manage student and vendor verification requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="students">
                <TabsList className="mb-4">
                  <TabsTrigger value="students">Students/Faculty ({pendingVerifications.length})</TabsTrigger>
                  <TabsTrigger value="vendors">Vendors ({pendingVendors.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="students">
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Name</th>
                            <th className="px-4 py-3 text-left font-medium">Institute</th>
                            <th className="px-4 py-3 text-left font-medium">Role</th>
                            <th className="px-4 py-3 text-left font-medium">ID/Roll No.</th>
                            <th className="px-4 py-3 text-left font-medium">Applied On</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingVerifications.map((student) => (
                            <tr key={student._id} className="border-b">
                              <td className="px-4 py-3">{student.name}</td>
                              <td className="px-4 py-3">{student.institute}</td>
                              <td className="px-4 py-3">
                                <Badge variant={student.role === "STUDENT" ? "default" : "outline"}>
                                  {student.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3">{student.instituteId}</td>
                              <td className="px-4 py-3">
                                {new Date(student.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => viewStudentDetails(student)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View details</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600"
                                    onClick={() => approveUser(student._id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">Approve</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600"
                                    onClick={() => rejectUser(student._id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span className="sr-only">Reject</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vendors">
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Business Name</th>
                            <th className="px-4 py-3 text-left font-medium">Contact Person</th>
                            <th className="px-4 py-3 text-left font-medium">Category</th>
                            <th className="px-4 py-3 text-left font-medium">Mobile</th>
                            <th className="px-4 py-3 text-left font-medium">Applied On</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingVendors.map((vendor) => (
                            <tr key={vendor._id} className="border-b">
                              <td className="px-4 py-3">{vendor.businessName}</td>
                              <td className="px-4 py-3">{vendor.contactName}</td>
                              <td className="px-4 py-3">{vendor.businessCategory}</td>
                              <td className="px-4 py-3">{vendor.mobile}</td>
                              <td className="px-4 py-3">
                                {new Date(vendor.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => viewVendorDetails(vendor)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View details</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600"
                                    onClick={() => approveVendor(vendor._id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">Approve</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600"
                                    onClick={() => rejectVendor(vendor._id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    <span className="sr-only">Reject</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Student verification dialog */}
      <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student Verification Details</DialogTitle>
            <DialogDescription>Review student information and ID card links</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Institute</p>
                    <p className="font-medium">{selectedStudent.institute}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant={selectedStudent.role === "STUDENT" ? "default" : "outline"}>
                      {selectedStudent.role}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ID/Roll Number</p>
                    <p className="font-medium">{selectedStudent.instituteId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Number</p>
                    <p className="font-medium">{selectedStudent.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Applied On</p>
                    <p className="font-medium">
                      {new Date(selectedStudent.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">ID Card Verification</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Front Side</p>
                    <a
                      href={selectedStudent.idCardFront}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View ID Card Front
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Back Side</p>
                    <a
                      href={selectedStudent.idCardBack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View ID Card Back
                    </a>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={() => setIsStudentDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={() => rejectUser(selectedStudent._id)}>
                  Reject
                </Button>
                <Button onClick={() => approveUser(selectedStudent._id)}>Approve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vendor verification dialog */}
      <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vendor Verification Details</DialogTitle>
            <DialogDescription>Review vendor information and documents</DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Business Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Name</p>
                    <p className="font-medium">{selectedVendor.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{selectedVendor.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedVendor.businessCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Number</p>
                    <p className="font-medium">{selectedVendor.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Applied On</p>
                    <p className="font-medium">
                      {new Date(selectedVendor.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Business Documents</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">GST Certificate</p>
                    <div className="border rounded-md overflow-hidden">
                      <Image
                        src={selectedVendor.gst || "https://placehold.co/320x200"}
                        alt={`GST Certificate for ${selectedVendor.businessName}`}
                        style={{ width: '100%', height: 'auto' }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">PAN Card</p>
                    <div className="border rounded-md overflow-hidden">
                      <Image
                        src={selectedVendor.pan || "https://placehold.co/320x200"}
                        alt={`PAN Card for ${selectedVendor.businessName}`}
                        style={{ width: '100%', height: 'auto' }}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <Button variant="outline" onClick={() => setIsVendorDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={() => rejectVendor(selectedVendor._id)}>
                  Reject
                </Button>
                <Button onClick={() => approveVendor(selectedVendor._id)}>Approve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}