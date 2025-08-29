"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import {
  Download,
  Eye,
  Filter,
  Package,
  Search,
  Truck,
  X,
  MoreHorizontal,
  RefreshCw,
  MessageCircle,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    genericName: string;
    images: string[];
    discountPrice: number;
  };
  quantity: number;
  price: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  vendor: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  institute: string;
  branch: string;
  currentYear: string;
  passoutYear: string;
  role: string;
  stream: string;
  isVerified: boolean;
}

interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  placedAt: string;
}

interface Vendor {
  _id: string;
  businessName: string;
}

const statusColors = {
  Pending: "bg-gray-500",
  Processing: "bg-yellow-500",
  Shipped: "bg-blue-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

const statusLabels = {
  Pending: "Pending",
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  >("all");
  const [dateFilter, setDateFilter] = useState<
    "all" | "7days" | "30days" | "90days"
  >("all");
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isItemDetailOpen, setIsItemDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/vendor/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setVendor(data.user[0]);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to fetch profile.",
          });
          router.push("/vendor/login");
        }
      } catch (error) {
        console.error("ProfilePage - Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile.",
        });
        router.push("/vendor/login");
      }
    };

    fetchUserProfile();
  }, [router, toast]);

  useEffect(() => {
    async function fetchOrders() {
      if (!vendor?._id) return;
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/vendor?vendorId=${vendor._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        console.log(data);
        const ordersArray = Array.isArray(data) ? data : data.filteredOrders || [];
        setOrders(ordersArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [vendor?._id, refreshIndex]);

  async function updateStatus(orderId: string, productId: string, newStatus: string) {
    try {
      const res = await fetch('/api/orders/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, productId, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setRefreshIndex(i => i + 1);
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    }
  }

  const allItems = orders.flatMap((order) =>
    order.items.map((item) => ({ ...item, orderId: order._id, order }))
  ) as (OrderItem & { orderId: string; order: Order })[];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.order.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(item.order.placedAt);
      if (isNaN(orderDate.getTime())) return false;
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (dateFilter) {
        case "7days":
          matchesDate = daysDiff <= 7;
          break;
        case "30days":
          matchesDate = daysDiff <= 30;
          break;
        case "90days":
          matchesDate = daysDiff <= 90;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "Pending":
        return 10;
      case "Processing":
        return 25;
      case "Shipped":
        return 50;
      case "Delivered":
        return 100;
      case "Cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const getProgressBarColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
  };

  const openItemDetail = (item: OrderItem, order: Order) => {
    setSelectedItem(item);
    setSelectedOrder(order);
    setIsItemDetailOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-muted/30 text-blue-950">
      <div className="hidden md:flex w-64 flex-col bg-card border-r h-full">
        <div className="p-4 border-b">
          <h2 className="font-bold text-xl">Vendor Dashboard</h2>
        </div>
        <div className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            <Link
              href="/vendor/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/vendor/products"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              Products
            </Link>
            <Link
              href="/vendor/orders"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-950 text-primary-foreground"
            >
              <Package className="mr-3 h-5 w-5" />
              Orders
            </Link>
            <Link
              href="/vendor/customers"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
            >
              <Users className="mr-3 h-5 w-5" />
              Customers
            </Link>
            <Link
              href="/vendor/settings"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-blue-950 hover:bg-muted"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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
                  <Input
                    type="search"
                    placeholder="Search by order ID, product name, or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full md:w-60 lg:w-80"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 dx-icon" />
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-blue-950 text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  3
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <span className="sr-only">Open vendor menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-950 text-primary-foreground flex items-center justify-center">
                      {vendor?.businessName.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="text-blue-950">{vendor?.businessName}</DropdownMenuLabel>
                  <DropdownMenuItem className="text-blue-950">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="text-blue-950">Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-blue-950">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Track and manage orders</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Filters and Search */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by order ID, product name, or user..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                      aria-label="Search orders"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(
                        value as
                          | "all"
                          | "Pending"
                          | "Processing"
                          | "Shipped"
                          | "Delivered"
                          | "Cancelled"
                      )
                    }
                  >
                    <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={dateFilter}
                    onValueChange={(value) =>
                      setDateFilter(value as "all" | "7days" | "30days" | "90days")
                    }
                  >
                    <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    aria-label="Filter orders"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <div className="space-y-6">
            {isLoading ? (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    Loading orders...
                  </p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : filteredItems.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                      ? "Try adjusting your filters or search terms"
                      : "No orders found for your products"}
                  </p>
                  <Button
                    asChild
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Link href="/vendor/products">Manage Products</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredItems.map((item) => (
                <Card
                  key={item._id}
                  className="hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {item.orderId} - {item.product.genericName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Placed on {formatDate(item.order.placedAt)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Ordered by: {item.order.user.name} ({item.order.user.email})
                            </p>
                          </div>
                          <Badge
                            className={`${
                              statusColors[item.status]
                            } text-white px-3 py-1`}
                          >
                            {statusLabels[item.status]}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Product Details
                            </p>
                            <div className="flex items-center gap-3">
                              <Image
                                src={item.product.images[0] || "/placeholder.svg"}
                                alt={item.product.genericName}
                                className="w-12 h-12 object-cover rounded-md"
                                height={48}
                                width={48}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {item.product.genericName}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  Sold by {item.vendor}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Order Progress
                            </p>
                            <Progress
                              value={getStatusProgress(item.status)}
                              className={`h-2 ${getProgressBarColor(item.status)}`}
                            />
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                              {item.status === "Delivered" &&
                                "Product delivered successfully"}
                              {item.status === "Shipped" &&
                                "Product is on the way"}
                              {item.status === "Processing" &&
                                "Product is being processed"}
                              {item.status === "Pending" &&
                                "Product order is pending"}
                              {item.status === "Cancelled" &&
                                "Product order was cancelled"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                              {item.order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button
                          variant="outline"
                          onClick={() => openItemDetail(item, item.order)}
                          className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label={`View details for product ${item.product.genericName}`}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>

                        {item.status === "Delivered" && (
                          <Button
                            variant="outline"
                            className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label={`Download invoice for product ${item.product.genericName}`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        )}

                        {item.status === "Shipped" && (
                          <Button
                            variant="outline"
                            className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label={`Track product ${item.product.genericName}`}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Track Product
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                              aria-label={`More actions for product ${item.product.genericName}`}
                            >
                              <MoreHorizontal className="h-4 w-4 mr-2" />
                              More Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 bg-white dark:bg-gray-800"
                          >
                            {item.status === "Pending" && (
                              <>
                                <DropdownMenuItem
                                  onSelect={() => updateStatus(item.orderId, item.product._id, "Processing")}
                                  className="text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-900 cursor-pointer"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}

                            {item.status === "Processing" && (
                              <>
                                <DropdownMenuItem
                                  onSelect={() => updateStatus(item.orderId, item.product._id, "Shipped")}
                                  className="text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-900 cursor-pointer"
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Mark as Shipped
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}

                            {!["Delivered", "Cancelled"].includes(item.status) && (
                              <>
                                <DropdownMenuItem
                                  onSelect={() => updateStatus(item.orderId, item.product._id, "Cancelled")}
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900 cursor-pointer"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Product
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}

                            <DropdownMenuItem
                              className="cursor-pointer"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Buyer
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cursor-pointer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      <Dialog open={isItemDetailOpen} onOpenChange={setIsItemDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          {selectedItem && selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">
                  Product Details - {selectedItem.product.genericName}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300">
                  Order {selectedOrder._id} • Placed on{" "}
                  {formatDate(selectedOrder.placedAt)} • Ordered by{" "}
                  {selectedOrder.user.name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      User Details
                    </h4>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">
                        Name: {selectedOrder.user.name}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Email: {selectedOrder.user.email}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Mobile: {selectedOrder.user.mobile}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Institute: {selectedOrder.user.institute}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Branch: {selectedOrder.user.branch} ({selectedOrder.user.stream})
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Year: {selectedOrder.user.currentYear} (Passout: {selectedOrder.user.passoutYear})
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Role: {selectedOrder.user.role}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Verified: {selectedOrder.user.isVerified ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Shipping Address
                    </h4>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedOrder.shippingAddress.address},{" "}
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state} -{" "}
                        {selectedOrder.shippingAddress.pincode},{" "}
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Payment Information
                    </h4>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedOrder.paymentMethod}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Status: {selectedOrder.paymentStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Product Ordered
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <Image
                        src={selectedItem.product.images[0] || "/placeholder.svg"}
                        alt={selectedItem.product.genericName}
                        className="w-16 h-16 object-cover rounded-md"
                        height={64}
                        width={64}
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-gray-900 dark:text-white">
                          {selectedItem.product.genericName}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Sold by {selectedItem.vendor}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Status: {selectedItem.status}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            Qty: {selectedItem.quantity}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ₹{(selectedItem.price * selectedItem.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-gray-200 dark:bg-gray-600" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                      <span>Subtotal</span>
                      <span>₹{(selectedItem.price * selectedItem.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                      <span>Shipping</span>
                      <span className="text-green-600 dark:text-green-400">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>₹{(selectedItem.price * selectedItem.quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {selectedItem.status === "Pending" && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => updateStatus(selectedOrder?._id || "", selectedItem.product._id, "Processing")}
                        aria-label={`Mark product ${selectedItem.product.genericName} as Processing`}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Mark as Processing
                      </Button>
                    )}
                    {selectedItem.status === "Processing" && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => updateStatus(selectedItem?._id || "", selectedItem.product._id, "Shipped")}
                        aria-label={`Mark product ${selectedItem.product.genericName} as Shipped`}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Mark as Shipped
                      </Button>
                    )}
                    {!["Delivered", "Cancelled"].includes(selectedItem.status) && (
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        variant="destructive"
                        onClick={() => updateStatus(selectedItem?._id || "", selectedItem.product._id, "Cancelled")}
                        aria-label={`Cancel product ${selectedItem.product.genericName}`}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel Product
                      </Button>
                    )}
                    <Button
                      className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      variant="outline"
                      aria-label={`Download invoice for product ${selectedItem.product.genericName}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}