"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Box,
  ChevronDown,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Tag,
  Trash2,
  Users,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for products
const vendorProducts = [
  {
    id: 1,
    name: "Premium Noise-Cancelling Headphones",
    price: 129.99,
    originalPrice: 249.99,
    category: "Electronics",
    status: "active",
    stock: 45,
    sales: 128,
  },
  {
    id: 2,
    name: "Ultrabook Pro 14-inch",
    price: 899.99,
    originalPrice: 1299.99,
    category: "Electronics",
    status: "active",
    stock: 12,
    sales: 32,
  },
  {
    id: 3,
    name: "Design Software Annual Subscription",
    price: 99.99,
    originalPrice: 199.99,
    category: "Software & Subscriptions",
    status: "active",
    stock: 999,
    sales: 256,
  },
  {
    id: 4,
    name: "Smart Fitness Tracker",
    price: 59.99,
    originalPrice: 99.99,
    category: "Electronics",
    status: "pending",
    stock: 78,
    sales: 0,
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 79.99,
    originalPrice: 149.99,
    category: "Electronics",
    status: "active",
    stock: 34,
    sales: 89,
  },
]

// Mock data for orders
const vendorOrders = [
  {
    id: "ORD-001",
    customer: "Rahul Sharma",
    date: "2023-05-15T10:30:00",
    total: 129.99,
    status: "delivered",
    items: 1,
  },
  {
    id: "ORD-002",
    customer: "Priya Patel",
    date: "2023-05-14T14:20:00",
    total: 899.99,
    status: "shipped",
    items: 1,
  },
  {
    id: "ORD-003",
    customer: "Amit Kumar",
    date: "2023-05-13T09:15:00",
    total: 159.98,
    status: "processing",
    items: 2,
  },
  {
    id: "ORD-004",
    customer: "Sneha Gupta",
    date: "2023-05-12T16:45:00",
    total: 59.99,
    status: "delivered",
    items: 1,
  },
  {
    id: "ORD-005",
    customer: "Vikram Singh",
    date: "2023-05-11T11:30:00",
    total: 179.98,
    status: "cancelled",
    items: 2,
  },
]

export default function VendorDashboard() {
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-card border-r h-full">
        <div className="p-4 border-b">
          <h2 className="font-bold text-xl">Vendor Dashboard</h2>
        </div>
        <div className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            <Link
              href="/vendor/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/vendor/products"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              Products
            </Link>
            <Link
              href="/vendor/orders"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Package className="mr-3 h-5 w-5" />
              Orders
            </Link>
            <Link
              href="/vendor/customers"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Users className="mr-3 h-5 w-5" />
              Customers
            </Link>
            <Link
              href="/vendor/settings"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/vendor/login">
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
              <h2 className="ml-2 font-semibold">Vendor Dashboard</h2>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      V
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>TechGadgets India</DropdownMenuLabel>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, TechGadgets India</p>
            </div>
            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Fill in the details to add a new product to your store</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input id="product-name" placeholder="Enter product name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="books">Books & Stationery</SelectItem>
                          <SelectItem value="software">Software & Subscriptions</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price (₹)</Label>
                      <Input id="product-price" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-original-price">Original Price (₹)</Label>
                      <Input id="product-original-price" type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-stock">Stock Quantity</Label>
                      <Input id="product-stock" type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-sku">SKU</Label>
                      <Input id="product-sku" placeholder="Enter SKU" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea id="product-description" placeholder="Enter product description" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-center flex-col gap-2">
                        <Box className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag & drop product images or click to browse</p>
                        <Button variant="outline" size="sm">
                          Upload Images
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Product</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <h3 className="text-2xl font-bold mt-1">₹24,567</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <h3 className="text-2xl font-bold mt-1">156</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Products</p>
                    <h3 className="text-2xl font-bold mt-1">32</h3>
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
                    <p className="text-sm font-medium text-muted-foreground">Customers</p>
                    <h3 className="text-2xl font-bold mt-1">1,245</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products" className="mb-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>Manage your product listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Product Name</th>
                            <th className="px-4 py-3 text-left font-medium">Category</th>
                            <th className="px-4 py-3 text-left font-medium">Price</th>
                            <th className="px-4 py-3 text-left font-medium">Stock</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorProducts.map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="px-4 py-3">{product.name}</td>
                              <td className="px-4 py-3">{product.category}</td>
                              <td className="px-4 py-3">
                                <div className="flex flex-col">
                                  <span>₹{product.price}</span>
                                  <span className="text-xs text-muted-foreground line-through">
                                    ₹{product.originalPrice}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">{product.stock}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant={product.status === "active" ? "default" : "secondary"}
                                  className={product.status === "pending" ? "bg-amber-500 hover:bg-amber-600" : ""}
                                >
                                  {product.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Settings className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>View and manage your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Order ID</th>
                            <th className="px-4 py-3 text-left font-medium">Customer</th>
                            <th className="px-4 py-3 text-left font-medium">Date</th>
                            <th className="px-4 py-3 text-left font-medium">Total</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorOrders.map((order) => (
                            <tr key={order.id} className="border-b">
                              <td className="px-4 py-3 font-medium">{order.id}</td>
                              <td className="px-4 py-3">{order.customer}</td>
                              <td className="px-4 py-3">
                                {new Date(order.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3">₹{order.total.toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    order.status === "delivered"
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : order.status === "shipped"
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : order.status === "processing"
                                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                                          : "bg-red-500 hover:bg-red-600 text-white"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="ghost" size="sm">
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
