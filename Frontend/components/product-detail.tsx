"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

interface ProductDetailProps {
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
    images?: string[]
  } | null
  open: boolean
  onClose: () => void
}

export default function ProductDetail({ product, open, onClose }: ProductDetailProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    console.log("ProductDetail - Product prop:", product)
    console.log("ProductDetail - Product images:", product?.images || [product?.image])
    console.log("ProductDetail - Open state:", open)
    if (!product) {
      console.warn("ProductDetail - Product is null or undefined")
    } else {
      const requiredFields = ["id", "name", "price", "originalPrice", "image", "discount", "rating", "reviews", "href"];
      requiredFields.forEach(field => {
        if (!(field in product) || product[field as keyof typeof product] === undefined || product[field as keyof typeof product] === null) {
          console.warn(`ProductDetail - Missing or invalid field: ${field}`);
        }
      });
    }
    // Debug DialogContent width
    if (open) {
      const dialogContent = document.querySelector('[data-radix-dialog-content]') as HTMLElement;
      if (dialogContent) {
        const computedWidth = window.getComputedStyle(dialogContent).width;
        console.log("ProductDetail - DialogContent computed width:", computedWidth);
      }
    }
  }, [product, open])

  if (!product || !product.name || !product.id || !product.price || !product.originalPrice || !product.discount || !product.rating || !product.reviews || !product.href) {
    console.warn("ProductDetail - Invalid product data, rendering fallback UI")
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[1600px] p-6" style={{ maxWidth: '1600px' }}>
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Error</DialogTitle>
            </VisuallyHidden>
            <DialogDescription>Product details are unavailable</DialogDescription>
          </DialogHeader>
          <div className="text-center text-red-600">
            <p>Error: No valid product data provided.</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image || "https://placehold.co/400x400/png", "https://placehold.co/400x400/png", "https://placehold.co/400x400/png", "https://placehold.co/400x400/png"]

  console.log("ProductDetail - Selected image index:", selectedImage)
  console.log("ProductDetail - Current image:", productImages[selectedImage])

  const specifications = [
    { name: "Brand", value: "TechPro" },
    { name: "Model", value: "XP-2023" },
    { name: "Color", value: "Black" },
    { name: "Connectivity", value: "Bluetooth 5.0" },
    { name: "Battery Life", value: "Up to 30 hours" },
    { name: "Warranty", value: "1 Year Manufacturer Warranty" },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-6" style={{ maxWidth: '1000px' }}>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{product.name}</DialogTitle>
          </VisuallyHidden>
          <DialogDescription>View product details, specifications, and reviews</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={productImages[selectedImage] || "https://placehold.co/400x400/png"}
                alt={`${product.name} - Main view`}
                width={400}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="aspect-square object-cover rounded-md"
                loading="lazy"
                onError={(e) => {
                  console.error("ProductDetail - Image load error for main image:", productImages[selectedImage])
                  e.currentTarget.src = "https://placehold.co/400x400/png"
                }}
              />
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`border rounded-md overflow-hidden cursor-pointer ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "https://placehold.co/100x100/png"}
                    alt={`${product.name} - View ${index + 1}`}
                    width={100}
                    height={100}
                    style={{ width: '100%', height: 'auto' }}
                    className="aspect-square object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error("ProductDetail - Image load error for thumbnail:", image)
                      e.currentTarget.src = "https://placehold.co/100x100/png"
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              {/* <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button> */}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="text-sm font-medium ml-1">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">₹{product.price}</span>
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
              <Badge className="bg-green-600 hover:bg-green-700">
                Save ₹{(product.originalPrice - product.price).toFixed(2)}
              </Badge>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="w-full grid grid-cols-3 gap-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground">
                  Experience premium sound quality with these noise-cancelling headphones. Perfect for students who need
                  to focus on their studies or enjoy music without distractions. The comfortable ear cushions allow for
                  extended wear, and the foldable design makes them easy to carry in your backpack.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Active Noise Cancellation
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    30-hour Battery Life
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Bluetooth 5.0 Connectivity
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Foldable Design
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="specifications" className="mt-4">
                <div className="space-y-2">
                  {specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 py-2 border-b last:border-0">
                      <span className="font-medium">{spec.name}</span>
                      <span>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${star <= Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">Based on {product.reviews} reviews</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reviews will be shown here. Currently, this is a placeholder for the review section.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-4">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-9 w-9">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="secondary" size="lg">
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleWishlist}
                  className={`h-11 w-11 ${isWishlisted ? "text-red-500" : ""}`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Student Discount:</span> Verified students get an additional 10% off on this
                product.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}