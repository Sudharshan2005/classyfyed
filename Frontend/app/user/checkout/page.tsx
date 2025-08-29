"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Shield,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";

// Interfaces from previous context
interface Address {
  id: string;
  name: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface User {
  _id: string;
  institute: string;
  role: "STUDENT" | "FACULTY";
  name: string;
  instituteId: string;
  mobile: string;
  email: string;
  gender: string;
  dob: string;
  stream?: string;
  branch?: string;
  currentYear?: string;
  passoutYear?: string;
  idCardFront: string;
  idCardBack: string;
  driveLink?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  productId: {
    _id: string;
    genericName: string;
    originalPrice: number;
    discountPrice: number;
    images: string[];
  };
  quantity: number;
}

// Interfaces for the API payload
interface IOrderItem {
  product: string;
  price: number;
  quantity: number;
  status: string;
}

interface IShippingAddress {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  country: string;
}

// Mock saved addresses
const savedAddresses: Address[] = [
  {
    id: "addr_1",
    name: "Home",
    fullName: "Rahul Sharma",
    address: "123 Student Hostel, Delhi University",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110007",
    phone: "9876543210",
    isDefault: true,
  },
  {
    id: "addr_2",
    name: "College",
    fullName: "Rahul Sharma",
    address: "Room 204, Boys Hostel, DTU Campus",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110042",
    phone: "9876543210",
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState<string>("new");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [step, setStep] = useState<number>(1);
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user[0]);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to fetch profile.",
          });
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("ProfilePage - Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile.",
        });
        router.push("/auth/login");
      }
    };

    fetchUserProfile();
  }, [router, toast]);

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart/${user.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
        const data = await response.json();
        console.log(data);
        if (data.items) {
          setCartItems(data.items);
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to fetch cart.",
          });
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast({
          description: "An error occurred while fetching your cart.",
        });
      }
    };

    fetchCart();
  }, [user?.email, toast]);

  const handlePlaceOrder = async () => {
    if (!user?._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated. Please log in.",
      });
      router.push("/auth/login");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Your cart is empty.",
      });
      return;
    }

    if (selectedAddress === "new") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a valid shipping address.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedAddressData = savedAddresses.find(
        (addr) => addr.id === selectedAddress
      );
      if (!selectedAddressData) {
        throw new Error("Selected address not found");
      }

      const orderItems: IOrderItem[] = cartItems.map((item) => ({
        product: item.productId._id,
        price: item.productId.discountPrice,
        quantity: item.quantity,
        status: "Pending",
      }));

      const shippingAddress: IShippingAddress = {
        address: selectedAddressData.address,
        city: selectedAddressData.city,
        state: selectedAddressData.state,
        pincode: selectedAddressData.pincode,
        phone: selectedAddressData.phone,
        country: selectedAddressData.state
      };

      const response = await fetch("/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          items: orderItems,
          shippingAddress,
          paymentMethod,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Order placed successfully!",
        });
        router.push("/order-success")
      } else {
        throw new Error(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while placing your order.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.productId.discountPrice * item.quantity,
    0
  );
  const discount = cartItems.reduce(
    (total, item) =>
      total + (item.productId.originalPrice - item.productId.discountPrice) * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax + shipping;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="flex items-center mb-6">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              aria-label="Back to cart"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-blue-950 text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Shipping</span>
              </div>
              <div className={`h-px w-16 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-blue-950 text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
              <div className={`h-px w-16 ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-blue-950 text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Review</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {step === 1 && (
                <Card className="shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900 dark:text-white">
                      <MapPin className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Delivery Address
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Choose where you want your order delivered
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={selectedAddress}
                      onValueChange={setSelectedAddress}
                      className="space-y-3"
                    >
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <RadioGroupItem
                            value={address.id}
                            id={address.id}
                            className="mt-1 p-2"
                            aria-label={`Select ${address.name} address`}
                          />
                          <div className="flex-1 pl-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Label
                                htmlFor={address.id}
                                className="font-medium text-gray-900 dark:text-white"
                              >
                                {address.name}
                              </Label>
                              {address.isDefault && (
                                <Badge
                                  variant="secondary"
                                  className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {address.fullName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {address.address}, {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Phone: {address.phone}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <RadioGroupItem
                          value="new"
                          id="new"
                          className="mt-1"
                          aria-label="Add new address"
                        />
                        <div className="flex-1 pl-2">
                          <Label
                            htmlFor="new"
                            className="font-medium text-gray-900 dark:text-white"
                          >
                            Add New Address
                          </Label>
                          {selectedAddress === "new" && (
                            <div className="mt-4 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="firstName"
                                    className="text-gray-900 dark:text-white"
                                  >
                                    First Name
                                  </Label>
                                  <Input
                                    id="firstName"
                                    placeholder="Enter first name"
                                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="lastName"
                                    className="text-gray-900 dark:text-white"
                                  >
                                    Last Name
                                  </Label>
                                  <Input
                                    id="lastName"
                                    placeholder="Enter last name"
                                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label
                                  htmlFor="phone"
                                  className="text-gray-900 dark:text-white"
                                >
                                  Phone Number
                                </Label>
                                <Input
                                  id="phone"
                                  placeholder="Enter phone number"
                                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="address"
                                  className="text-gray-900 dark:text-white"
                                >
                                  Address
                                </Label>
                                <Textarea
                                  id="address"
                                  placeholder="Enter full address"
                                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="city"
                                    className="text-gray-900 dark:text-white"
                                  >
                                    City
                                  </Label>
                                  <Input
                                    id="city"
                                    placeholder="Enter city"
                                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="state"
                                    className="text-gray-900 dark:text-white"
                                  >
                                    State
                                  </Label>
                                  <Select>
                                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="delhi">Delhi</SelectItem>
                                      <SelectItem value="mumbai">Mumbai</SelectItem>
                                      <SelectItem value="bangalore">Bangalore</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="pincode"
                                    className="text-gray-900 dark:text-white"
                                  >
                                    Pincode
                                  </Label>
                                  <Input
                                    id="pincode"
                                    placeholder="Enter pincode"
                                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="addressType"
                                    className="text-gray-900 dark:text-white"
                                  >
                                    Address Type
                                  </Label>
                                  <Select>
                                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="home">Home</SelectItem>
                                      <SelectItem value="office">Office</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="defaultAddress" />
                                <Label
                                  htmlFor="defaultAddress"
                                  className="text-gray-900 dark:text-white"
                                >
                                  Make this my default address
                                </Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </RadioGroup>

                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => setStep(2)}
                        className="bg-blue-950 hover:bg-blue-800 cursor-pointer"
                        aria-label="Continue to payment"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card className="shadow-lg bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900 dark:text-white">
                      <CreditCard className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Payment Method
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Choose your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-700">
                        <TabsTrigger
                          value="card"
                          className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          Card
                        </TabsTrigger>
                        <TabsTrigger
                          value="upi"
                          className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          UPI
                        </TabsTrigger>
                        <TabsTrigger
                          value="netbanking"
                          className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          Net Banking
                        </TabsTrigger>
                        <TabsTrigger
                          value="wallet"
                          className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                          Wallet
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="card" className="space-y-4">
                        <div>
                          <Label
                            htmlFor="cardNumber"
                            className="text-gray-900 dark:text-white"
                          >
                            Card Number
                          </Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="expiry"
                              className="text-gray-900 dark:text-white"
                            >
                              Expiry Date
                            </Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="cvv"
                              className="text-gray-900 dark:text-white"
                            >
                              CVV
                            </Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor="cardName"
                            className="text-gray-900 dark:text-white"
                          >
                            Name on Card
                          </Label>
                          <Input
                            id="cardName"
                            placeholder="Enter name as on card"
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="saveCard" />
                          <Label
                            htmlFor="saveCard"
                            className="text-gray-900 dark:text-white"
                          >
                            Save this card for future purchases
                          </Label>
                        </div>
                      </TabsContent>

                      <TabsContent value="upi" className="space-y-4">
                        <div>
                          <Label
                            htmlFor="upiId"
                            className="text-gray-900 dark:text-white"
                          >
                            UPI ID
                          </Label>
                          <Input
                            id="upiId"
                            placeholder="yourname@paytm"
                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            You will be redirected to your UPI app to complete the payment
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="netbanking" className="space-y-4">
                        <div>
                          <Label
                            htmlFor="bank"
                            className="text-gray-900 dark:text-white"
                          >
                            Select Bank
                          </Label>
                          <Select>
                            <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                              <SelectValue placeholder="Choose your bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sbi">State Bank of India</SelectItem>
                              <SelectItem value="hdfc">HDFC Bank</SelectItem>
                              <SelectItem value="icici">ICICI Bank</SelectItem>
                              <SelectItem value="axis">Axis Bank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>

                      <TabsContent value="wallet" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="text-center">
                              <div className="h-8 w-8 bg-blue-500 rounded mx-auto mb-2"></div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Paytm
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Balance: ₹1,250
                              </p>
                            </div>
                          </div>
                          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="text-center">
                              <div className="h-8 w-8 bg-purple-500 rounded mx-auto mb-2"></div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                PhonePe
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Balance: ₹850
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-6 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Back to shipping"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        className="bg-blue-950 hover:bg-blue-800"
                        aria-label="Review order"
                      >
                        Review Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <Card className="shadow-lg bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-white">
                        Order Review
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        Please review your order before placing it
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Delivery Address
                        </h4>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          {selectedAddress !== "new" ? (
                            (() => {
                              const address = savedAddresses.find(
                                (addr) => addr.id === selectedAddress
                              );
                              return address ? (
                                <>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {address.fullName}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {address.address}, {address.city}, {address.state} - {address.pincode}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Phone: {address.phone}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  No address selected
                                </p>
                              );
                            })()
                          ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Please select a saved address
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Payment Method
                        </h4>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Delivery Options
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              Free delivery by tomorrow
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Back to payment"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handlePlaceOrder}
                          className="bg-blue-950 hover:bg-blue-800 text-white"
                          aria-label="Place order"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Placing Order..." : "Place Order"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <Card className="sticky top-4 shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId._id} className="flex gap-3">
                        <Image
                          src={item.productId.images[0] || "/placeholder.svg"}
                          alt={item.productId.genericName}
                          className="w-16 h-16 object-cover rounded-md"
                          height={64}
                          width={64}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                            {item.productId.genericName}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-900 dark:text-white">
                              Qty: {item.quantity}
                            </span>
                            <div className="text-right">
                              <span className="font-medium text-gray-900 dark:text-white">
                                ₹{item.productId.discountPrice.toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-300 line-through ml-1">
                                ₹{item.productId.originalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4 bg-gray-200 dark:bg-gray-600" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                      <span>Shipping</span>
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                      <span>Tax (GST)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2 bg-gray-200 dark:bg-gray-600" />
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center text-green-700 dark:text-green-300">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Your order is protected</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      100% secure payment and buyer protection guarantee
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Package className="h-4 w-4 mr-2" />
                      <span>Free delivery on orders above ₹500</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Truck className="h-4 w-4 mr-2" />
                      <span>Estimated delivery: Tomorrow</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}