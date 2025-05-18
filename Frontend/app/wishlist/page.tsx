"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ProductDetail from "@/components/product-detail"
import Image from "next/image"

// Mock wishlist items
const initialWishlistItems = [
  {
    id: 1,
    name: "Premium Noise-Cancelling Headphones",
    price: 129.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 48,
    rating: 4.5,
    reviews: 128,
    href: "/product/premium-noise-cancelling-headphones",
  },
  {
    id: 3,
    name: "Design Software Annual Subscription",
    price: 99.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 50,
    rating: 4.2,
    reviews: 67,
    href: "/product/design-software-annual-subscription",
  },
  {
    id: 5,
    name: "Wireless Earbuds Pro",
    price: 79.99,
    originalPrice: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 47,
    rating: 4.4,
    reviews: 156,
    href: "/product/wireless-earbuds-pro",
  },
  {
    id: 7,
    name: "Productivity Suite Subscription",
    price: 69.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    discount: 46,
    rating: 4.3,
    reviews: 112,
    href: "/product/productivity-suite-subscription",
  },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    discount: number;
    rating: number;
    reviews: number;
    href: string;
  } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
  }

  const openProductDetail = (product: { id: number; name: string; price: number; originalPrice: number; image: string; discount: number; rating: number; reviews: number; href: string }) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
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
            <h1 className="text-2xl font-bold ml-auto">Your Wishlist</h1>
          </div>

          {wishlistItems.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden border rounded-lg hover:shadow-md transition-shadow">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full aspect-square object-cover cursor-pointer"
                        onClick={() => openProductDetail(item)}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove from wishlist</span>
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-medium text-sm line-clamp-2 mb-2 cursor-pointer hover:text-primary"
                        onClick={() => openProductDetail(item)}
                      >
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold">₹{item.price}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{item.originalPrice}</span>
                      </div>
                      <Button className="w-full" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added any products to your wishlist yet.
              </p>
              <Button asChild>
                <Link href="/collections">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedProduct && <ProductDetail product={selectedProduct} open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
