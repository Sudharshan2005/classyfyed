"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

// Mock cart items
const initialCartItems = [
  {
    id: 1,
    name: "Premium Noise-Cancelling Headphones",
    price: 129.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=100&width=100",
    quantity: 1,
  },
  {
    id: 2,
    name: "Design Software Annual Subscription",
    price: 99.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=100&width=100",
    quantity: 1,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold ml-auto">Your Cart</h1>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h2 className="font-semibold text-lg mb-4">Cart Items ({cartItems.length})</h2>
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <Image
                              src={"https://placehold.co/300x300"}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-md"
                              width={300}
                              height={300}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold">₹{item.price}</span>
                              <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
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
                        <Button className="w-full">Proceed to Checkout</Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="sm:max-w-md">
                        <div className="flex h-full flex-col">
                          <div className="flex-1 overflow-auto py-2">
                            <h3 className="text-lg font-medium mb-4">Checkout</h3>
                            <p className="text-muted-foreground mb-6">
                              This is a demo checkout. In a real application, this would connect to a payment gateway.
                            </p>
                            <div className="space-y-4">
                              <div className="rounded-lg border bg-card p-4">
                                <h4 className="font-medium mb-2">Order Summary</h4>
                                <div className="space-y-2">
                                  {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                      <span>
                                        {item.name} x {item.quantity}
                                      </span>
                                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <Button className="w-full mt-6">Complete Purchase</Button>
                          </div>
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
              <p className="text-muted-foreground mb-6">Looks like you haven&#39;t added any products to your cart yet.</p>
              <Button asChild>
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
