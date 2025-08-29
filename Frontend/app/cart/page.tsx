"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface CartItem {
  productId: {
    _id: string
    genericName: string
    originalPrice: number
    discountPrice: number
    images: string[]
  }
  quantity: number
}

// Interface for cart data from API
// interface Cart {
//   _id: string
//   userId: string
//   items: CartItem[]
// }

const decodeJwtPayload = (token: string | null): { userId?: string; email?: string } | null => {
  try {
    if (!token) return null
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return null
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [email, setEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const payload = decodeJwtPayload(token)
    if (!payload || !payload.email) {
      setError("Please log in to view your cart.")
      setIsLoading(false)
      router.push("/login")
      return
    }

    setEmail(payload.email || null)

    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart/${payload.email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        })
        const data = await response.json()
        if (data.items) {
          setCartItems(data.items)
        } else {
          setError(data.error || "Failed to fetch cart.")
          toast({ title: "Error", description: data.error || "Failed to fetch cart."})
        }
      } catch (err) {
        console.error("Error fetching cart:", err)
        setError("An error occurred while fetching your cart.")
        toast({ description: "An error occurred while fetching your cart." })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [router, toast])

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const token = localStorage.getItem('token')
    const payload = decodeJwtPayload(token)
    if (!payload || !payload.email) {
      setError("Please log in to update your cart.")
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productId,
          quantity: newQuantity,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setCartItems(
          cartItems.map((item) =>
            item.productId._id === productId ? { ...item, quantity: newQuantity } : item
          )
        )
        toast({ description: "Cart updated successfully!" })
      } else {
        setError(data.error || "Failed to update cart.")
        toast({ title: "Error", description: data.error || "Failed to update cart."})
      }
    } catch (err) {
      console.error("Error updating cart:", err)
      setError("An error occurred while updating your cart.")
      toast({ description: "An error occurred while updating your cart." })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    const token = localStorage.getItem('token')
    const payload = decodeJwtPayload(token)
    if (!payload || !payload.email) {
      setError("Please log in to update your cart.")
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productId,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setCartItems(cartItems.filter((item) => item.productId._id !== productId))
        toast({ description: "Item removed from cart!" })
      } else {
        setError(data.error || "Failed to remove item.")
        toast({ description: data.error || "Failed to remove item." })
      }
    } catch (err) {
      console.error("Error removing item:", err)
      setError("An error occurred while removing the item.")
      toast({ description: "An error occurred while removing the item." })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.productId.discountPrice * item.quantity, 0)
  }

  const calculateDiscount = () => {
    return cartItems.reduce(
      (total, item) => total + (item.productId.originalPrice - item.productId.discountPrice) * item.quantity,
      0
    )
  }

  const calculateTotal = () => {
    return calculateSubtotal()
  }

  return (
    <div className="flex min-h-screen flex-col text-blue-950">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold ml-auto">Your Cart</h1>
            {email && (
              <span className="ml-4 text-sm text-muted-foreground">Logged in as: {email}</span>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-center mb-6">{error}</div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <svg className="animate-spin h-10 w-10 text-blue-950" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
              <p>Loading your cart...</p>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h2 className="font-semibold text-lg mb-4">Cart Items ({cartItems.length})</h2>
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.productId._id} className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <Image
                              src={item.productId.images[0] || "https://placehold.co/300x300"}
                              alt={item.productId.genericName}
                              className="w-20 h-20 object-cover rounded-md"
                              width={300}
                              height={300}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.productId.genericName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold">₹{item.productId.discountPrice.toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{item.productId.originalPrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || isLoading}
                                  className="h-8 w-8"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                  disabled={isLoading}
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.productId._id)}
                                disabled={isLoading}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-8"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-green-600">-₹{calculateDiscount().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        className="w-full bg-blue-950 hover:bg-blue-800 cursor-pointer"
                        disabled={isLoading}
                      >
                        Proceed to Checkout
                      </Button>
                    </SheetTrigger>
                    <SheetContent 
                      side="right" 
                      className="sm:max-w-md bg-white dark:bg-gray-800 p-6 flex flex-col h-full"
                    >
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          Checkout
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                          This is a demo checkout. In a real application, this would connect to a secure payment gateway.
                        </p>
                        <div className="flex-1 overflow-auto space-y-6">
                          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                              Order Summary
                            </h4>
                            <div className="space-y-3">
                              {cartItems.map((item) => (
                                <div 
                                  key={item.productId._id} 
                                  className="flex justify-between text-sm text-gray-600 dark:text-gray-300"
                                >
                                  <span className="flex-1">
                                    {item.productId.genericName} 
                                    <span className="ml-1 text-gray-400">x{item.quantity}</span>
                                  </span>
                                  <span className="font-medium">
                                    ₹{(item.productId.discountPrice * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                            <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-white">
                              <span>Total</span>
                              <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-blue-950 hover:bg-blue-800 cursor-pointer"
                          disabled={isLoading}
                          onClick={() => router.push("/user/checkout")}
                        >
                          Complete Purchase
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                  </CardFooter>
                </Card>

                <div className="mt-6 p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Have a coupon?</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Student discount will be automatically applied at checkout after verification.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any products to your cart yet.</p>
              <Button className="bg-blue-950" asChild>
                <Link href="/collections">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}