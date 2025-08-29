"use client"

import { useState, useEffect, useCallback } from "react"
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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Student {
  _id: string
  name: string
  institute: string
  role: "STUDENT" | "FACULTY"
  instituteId: string
  mobile: string
  email: string
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

interface Product {
  _id: string
  images: string[]
  genericName: string
  originalPrice: number
  discountPrice: number
  category: string
  stock: number
  sales: number
  productModel: string
  color: string
  weight: string
  variants: { key: string; value: string }[]
  description: string
  reviews: { rating: number; comment: string; user: string }[]
  status: string
}

interface Admin {
  _id: string
  userId: string
  password: string
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [pendingVerifications, setPendingVerifications] = useState<Student[]>([])
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([])
  const [pendingProducts, setPendingProducts] = useState<Product[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false)
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""

  const fetchAdminProfile = useCallback(async () => {
      try {
        const response = await fetch('/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          setAdmin(data.user[0])
        } else {
          throw new Error(data.message || "Failed to fetch profile")
        }
      } catch (error) {
        console.error("Vendor Dashboard - Error fetching profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile.",
        })
        router.push("/admin/login")
      }
    }, [toast, router])

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/users`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()
        if (data.success) {
          setPendingVerifications(data.users || [])
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
          setPendingVendors(data.vendors || [])
        } else {
          console.error("AdminDashboard - Failed to fetch vendors:", data.message)
          setError(data.message || "Failed to fetch vendors")
        }
      } catch (err) {
        console.error("AdminDashboard - Error fetching vendors:", err)
        setError("Error fetching vendors")
      }
    }

    const fetchUnverifiedProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/product/unverified`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const data = await response.json()
        if (data.success) {
          setPendingProducts(data.products || [])
        } else {
          console.error("AdminDashboard - Failed to fetch products:", data.message)
          setError(data.message || "Failed to fetch products")
        }
      } catch (err) {
        console.error("AdminDashboard - Error fetching products:", err)
        setError("Error fetching products")
      }
    }

    fetchUnverifiedUsers()
    fetchUnverifiedVendors()
    fetchUnverifiedProducts()
    fetchAdminProfile()
  }, [BASE_URL, fetchAdminProfile])

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsStudentDialogOpen(true)
  }

  const viewVendorDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsVendorDialogOpen(true)
  }

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  // const approveUser = async (userId: string) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/api/auth/users/${userId}/verify`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ isVerified: true }),
  //     })
  //     const data = await response.json()
  //     if (data.success) {
  //       setPendingVerifications((prev) => prev.filter((user) => user._id !== userId))
  //       setIsStudentDialogOpen(false)
  //     } else {
  //       console.error("AdminDashboard - Failed to approve user:", data.message)
  //       setError(data.message || "Failed to approve user")
  //     }
  //   } catch (err) {
  //     console.error("AdminDashboard - Error approving user:", err)
  //     setError("Error approving user")
  //   }
  // }

  const approveUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, isVerified: true }),
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

  // const rejectUser = async (userId: string) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/api/auth/users/${userId}`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //     })
  //     const data = await response.json()
  //     if (data.success) {
  //       setPendingVerifications((prev) => prev.filter((user) => user._id !== userId))
  //       setIsStudentDialogOpen(false)
  //     } else {
  //       console.error("AdminDashboard - Failed to reject user:", data.message)
  //       setError(data.message || "Failed to reject user")
  //     }
  //   } catch (err) {
  //     console.error("AdminDashboard - Error rejecting user:", err)
  //     setError("Error rejecting user")
  //   }
  // }

  const rejectUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/reject`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
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

  const approveProduct = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/product/${productId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      })
      const data = await response.json()
      if (data.success) {
        setPendingProducts((prev) => prev.filter((product) => product._id !== productId))
        setIsProductDialogOpen(false)
        alert("Product Verified Successfully!")
      } else {
        console.error("AdminDashboard - Failed to approve product:", data.message)
        setError(data.message || "Failed to approve product")
      }
    } catch (err) {
      console.error("AdminDashboard - Error approving product:", err)
      setError("Error approving product")
    }
  }

  const rejectProduct = async (productId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/product/products/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (data.success) {
        setPendingProducts((prev) => prev.filter((product) => product._id !== productId))
        setIsProductDialogOpen(false)
      } else {
        console.error("AdminDashboard - Failed to reject product:", data.message)
        setError(data.message || "Failed to reject product")
      }
    } catch (err) {
      console.error("AdminDashboard - Error rejecting product:", err)
      setError("Error rejecting product")
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      router.push('/admin/login');
    } catch (err) {
      console.error("AdminDashboard - Error Logoutt:", err)
      setError("Error Logout")
    }
  }

  return (
    <div className="flex h-screen bg-muted/30 text-blue-950">
      <div className="hidden md:flex w-64 flex-col bg-card border-r h-full">
        <div className="p-4 border-b">
          <h2 className="font-bold text-xl">Admin Dashboard</h2>
        </div>
        <div className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-950 text-primary-foreground"
            >
              <Users className="mr-3 h-5 w-5" />
              Verifications
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
            >
              <Package className="mr-3 h-5 w-5" />
              Orders
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button onClick={handleLogout} variant="outline" className="w-full justify-start" asChild>
            <Link href="/admin/login">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
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
                <Bell className="h-5 w-5 dx-icon text-blue-950" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-blue-950 text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-950 text-primary-foreground flex items-center justify-center">
                      {admin?.userId.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-blue-950">
                  <DropdownMenuLabel>{admin?.userId}</DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back, {(admin?.userId ?? "").charAt(0).toUpperCase() + (admin?.userId ?? "").slice(1).toLowerCase()}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-6 text-blue-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Verifications</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {pendingVerifications.length + pendingVendors.length}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-950" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-blue-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Products</p>
                    <h3 className="text-2xl font-bold mt-1">{pendingProducts.length}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-950" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-blue-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <h3 className="text-2xl font-bold mt-1">1,254</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-950" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-blue-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">₹1,23,456</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-950" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 text-blue-950">
            <CardHeader>
              <CardTitle>Verification Requests</CardTitle>
              <CardDescription>Manage student, vendor, and product verification requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="students">
                <TabsList className="mb-4 text-blue-950">
                  <TabsTrigger className="text-blue-950" value="students">Students/Faculty ({pendingVerifications.length})</TabsTrigger>
                  <TabsTrigger className="text-blue-950" value="vendors">Vendors ({pendingVendors.length})</TabsTrigger>
                  <TabsTrigger className="text-blue-950" value="products">Products ({pendingProducts.length})</TabsTrigger>
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
                                <Badge className="bg-blue-950" variant={student.role === "STUDENT" ? "default" : "outline"}>
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

                <TabsContent value="products">
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">ID</th>
                            <th className="px-4 py-3 text-left font-medium">Name</th>
                            <th className="px-4 py-3 text-left font-medium">Price</th>
                            <th className="px-4 py-3 text-left font-medium">Category</th>
                            <th className="px-4 py-3 text-left font-medium">Model</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingProducts.map((product) => (
                            <tr key={product._id} className="border-b">
                              <td className="px-4 py-3">{product._id}</td>
                              <td className="px-4 py-3">{product.genericName}</td>
                              <td className="px-4 py-3">₹{product.discountPrice.toFixed(2)}</td>
                              <td className="px-4 py-3">{product.category}</td>
                              <td className="px-4 py-3">{product.productModel}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => viewProductDetails(product)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View details</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600"
                                    onClick={() => approveProduct(product._id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="sr-only">Approve</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-600"
                                    onClick={() => rejectProduct(product._id)}
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
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedStudent.email}</p>
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

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Verification Details</DialogTitle>
            <DialogDescription>Review product information and details</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <h3 className="font-semibold mb-4">Product Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-medium">{selectedProduct._id.slice(0,5)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedProduct.genericName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Original Price</p>
                      <p className="font-medium">₹{selectedProduct.originalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Discount Price</p>
                      <p className="font-medium">₹{selectedProduct.discountPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{selectedProduct.productModel}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className="font-medium">{selectedProduct.stock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sales</p>
                      <p className="font-medium">{selectedProduct.sales}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={selectedProduct.status === "active" ? "default" : "outline"}>
                      {selectedProduct.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Additional Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Color</p>
                      <p className="font-medium">{selectedProduct.color}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Weight</p>
                      <p className="font-medium">{selectedProduct.weight}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Variants</p>
                    <ul className="list-disc pl-5">
                      {selectedProduct.variants.map((variant, index) => (
                        <li key={index} className="text-sm">
                          {variant.key}: {variant.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="font-medium">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Reviews</p>
                    {selectedProduct.reviews.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedProduct.reviews.map((review, index) => (
                          <li key={index} className="text-sm">
                            {review.user}: {review.comment} (Rating: {review.rating}/5)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm">No reviews yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                    <p className="text-sm text-muted-foreground mb-2">Images</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.images.map((image, index) => (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <Image
                            src={image || "https://placehold.co/100x200"}
                            alt={`Product Image ${index + 1}`}
                            width={100}
                            height={200}
                            style={{ width: '100px', height: '200px', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="destructive" onClick={() => rejectProduct(selectedProduct._id)}>
                  Reject
                </Button>
                <Button onClick={() => approveProduct(selectedProduct._id)}>Approve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}