"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import ProductDetail from "@/components/product-detail"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    originalPrice: number
    image: string
    discount: number
    rating: number
    reviews: number
    href: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    console.log("ProductCard - Product prop:", product)
  }, [product])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-2 left-2 h-8 w-8 rounded-full ${
                isWishlisted ? "text-red-500" : "text-muted-foreground"
              }`}
              onClick={toggleWishlist}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={"https://placehold.co/300x300/png"}
                alt={product.name}
                width={300}
                height={300}
                style={{ width: '100%', height: 'auto' }}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  console.error("ProductCard - Image load error:")
                  e.currentTarget.src = "https://placehold.co/300x300/png"
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary">{product.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span className="text-xs font-medium ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">₹{product.price}</span>
                <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <ProductDetail product={product} open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </Dialog>
  )
}