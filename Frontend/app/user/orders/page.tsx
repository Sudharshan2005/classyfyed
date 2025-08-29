"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Eye,
  Filter,
  Package,
  Search,
  Star,
  Truck,
  X,
  MoreHorizontal,
  RefreshCw,
  MessageCircle,
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
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    genericName: string;
    image: string;
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

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  placedAt: string;
}

interface User {
  _id: string
  institute: string
  role: "STUDENT" | "FACULTY"
  name: string
  instituteId: string
  mobile: string
  email: string
  gender: string
  dob: string
  stream?: string
  branch?: string
  currentYear?: string
  passoutYear?: string
  idCardFront: string
  idCardBack: string
  driveLink?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
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
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [refreshIndex, setRefreshIndex] = useState(0);



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          setUser(data.user[0])
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to fetch profile.",
          })
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("ProfilePage - Error fetching profile:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile.",
        })
        router.push("/auth/login")
      }
    }

    fetchUserProfile()
  }, [toast, router])

  useEffect(() => {
      async function fetchOrders() {
        try {
          const response = await fetch(`/api/orders?userId=${user?._id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }
          const data = await response.json();
          setOrders(data);
        } catch (err) {
          console.error('Error fetching orders:', err);
        }
      }
      fetchOrders();
    }, [user?._id, refreshIndex]);

    async function updateStatus(orderId: string, productId: string) {
      try {
        const res = await fetch('/api/orders/update-status', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, productId, status: "Cancelled" }),
        });
        if (!res.ok) throw new Error('Failed to update status');
        setRefreshIndex(i => i + 1);
      } catch (err) {
        console.error(err);
        alert('Error updating status');
      }
    }

  const allItems = orders.flatMap((order) =>
    order.items.map((item) => ({ ...item, orderId: order._id, order }))
  );

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.genericName.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Orders
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track and manage your ordered products
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by order ID or product name..."
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
            {filteredItems.length === 0 ? (
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                      ? "Try adjusting your filters or search terms"
                      : "You haven't ordered any products yet"}
                  </p>
                  <Button
                    asChild
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Link href="/collections">Start Shopping</Link>
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
                                src={item.product.image || "/placeholder.svg"}
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
                                "Your product is on the way"}
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
                            className="w-48 bg-white dark:bg-gray-800"
                          >
                            {(item.status === "Pending" || item.status === "Processing") && (
                              <>
                                <DropdownMenuItem onClick={() => updateStatus(item.orderId, item.product._id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900">
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Product
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {item.status === "Delivered" && (
                              <>
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Return/Exchange
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Star className="h-4 w-4 mr-2" />
                                  Rate & Review
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Seller
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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
        </div>
      </main>

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
                  {formatDate(selectedOrder.placedAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
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
                        src={selectedItem.product.image || "/placeholder.svg"}
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
                    {selectedItem.status === "Delivered" && (
                      <>
                        <Button
                          className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          variant="outline"
                          aria-label={`Rate and review product ${selectedItem.product.genericName}`}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Rate & Review Product
                        </Button>
                        <Button
                          className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          variant="outline"
                          aria-label={`Return or exchange product ${selectedItem.product.genericName}`}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Return or Exchange
                        </Button>
                      </>
                    )}
                    {selectedItem.status === "Shipped" && (
                      <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        aria-label={`Track product ${selectedItem.product.genericName}`}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Product
                      </Button>
                    )}
                    {(selectedItem.status === "Pending" || selectedItem.status === "Processing") && (
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        variant="destructive"
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

      <Footer />
    </div>
  );
}