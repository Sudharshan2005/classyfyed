"use client"

import type React from "react"
import { useState } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import ProductDetail from "@/components/product-detail"
import { IReview } from "@/models/Product"

interface ProductCardProps {
  product: {
    _id: string
    images: string[]
    brandName: string
    mobile: string
    genericName: string
    originalPrice: number
    discountPrice: number
    reviews: IReview[]
    productModel?: string
    href: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const discount = ((product.originalPrice - product.discountPrice) / product.originalPrice * 100).toFixed(0)

  const rating = product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : "0"

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>
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
                src={"https://classyfyed.s3.us-east-1.amazonaws.com/product-placeholder.png"}
                alt={product.genericName}
                width={300}
                height={300}
                style={{ width: '100%', height: 'auto' }}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  console.error("ProductCard - Image load error:", product.images[0])
                  e.currentTarget.src = "https://placehold.co/300x300/png"
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm text-blue-950 line-clamp-2 mb-1 group-hover:text-primary">{product.genericName}</h3>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span className="text-xs font-medium ml-1">{rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg text-blue-950 font-bold">${product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-blue-950 line-through">${product.originalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="w-full bg-blue-950 hover:bg-blue-800 cursor-pointer">
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