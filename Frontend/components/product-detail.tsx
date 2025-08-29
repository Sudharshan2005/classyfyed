"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useToast } from "@/hooks/use-toast"
import { IReview } from "@/models/Product"

const decodeJwtPayload = (token: string | null): { email?: string } | null => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

interface ProductDetailProps {
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
    color?: string
    weight?: string
    description?: string
  } | null
  open: boolean
  onClose: () => void
}

export default function ProductDetail({ product, open, onClose }: ProductDetailProps) {
  const { toast } = useToast()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const payload = decodeJwtPayload(token);
    if (payload && payload.email) {
      setEmail(payload.email);
    } else {
      setEmail(null);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please log in to view wishlist status.",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!product?._id || !email) return;

    const fetchWishlistStatus = async () => {
      setWishlistLoading(true);
      try {
        const response = await fetch(`/api/wishlist/fetch?email=${encodeURIComponent(email)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });
        const data = await response.json();
        if (data.success && data.wishlist) {
          const isProductWishlisted = Array.isArray(data.wishlist.products) && 
            data.wishlist.products.some((_id: string) => _id === product._id);
          setIsWishlisted(isProductWishlisted);
        } else {
          setError(data.error || "Failed to load wishlist status.");
          toast({
            variant: "destructive",
            title: "Error",
            description: data.error || "Failed to load wishlist status.",
          });
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("An error occurred while fetching wishlist status.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load wishlist status.",
        });
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlistStatus();
  }, [product?._id, email, toast]);

  useEffect(() => {
    if (!product) {
      console.warn("ProductDetail - Product is null or undefined");
      setError("No product data available.");
      return;
    }

    const requiredFields = ["_id", "images", "brandName", "mobile", "genericName", "originalPrice", "discountPrice", "reviews", "href"];
    requiredFields.forEach(field => {
      if (!(field in product) || product[field as keyof typeof product] === undefined || product[field as keyof typeof product] === null) {
        console.warn(`ProductDetail - Missing or invalid field: ${field}`);
        setError(`Invalid product data: ${field} is missing or invalid.`);
      }
    });

    if (open) {
      const dialogContent = document.querySelector('[data-radix-dialog-content]') as HTMLElement;
      if (dialogContent) {
        const computedWidth = window.getComputedStyle(dialogContent).width;
        console.log("ProductDetail - DialogContent computed width:", computedWidth);
      }
    }
  }, [product, open]);

  const handleAddToCart = async () => {
    if (!email) {
      setError("Please log in to add items to your cart.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to add items to your cart.",
      });
      return;
    }

    if (!product?._id) {
      setError("Invalid product data.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid product data.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productId: product._id,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Product added to cart successfully!",
        });
      } else {
        setError(data.error || "Failed to add product to cart.");
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to add product to cart.",
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("An error occurred while adding to cart.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while adding to cart.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to update your wishlist.",
      });
      return;
    }

    if (!product?._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid product data.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    const newWishlistState = !isWishlisted;

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          email,
          productId: product._id,
          action: newWishlistState ? 'add' : 'remove',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsWishlisted(newWishlistState);
        toast({
          title: "Success",
          description: newWishlistState
            ? "Product added to wishlist!"
            : "Product removed from wishlist!",
        });
      } else {
        setError(data.error || "Failed to update wishlist.");
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to update wishlist.",
        });
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      setError("An error occurred while updating wishlist.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating wishlist.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (!product || !product._id || !product.genericName || !product.originalPrice || !product.discountPrice || !product.reviews || !product.href) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[1000px] p-6" style={{ maxWidth: '1000px' }}>
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Error</DialogTitle>
            </VisuallyHidden>
            <DialogDescription>Product details are unavailable</DialogDescription>
          </DialogHeader>
          <div className="text-center text-red-600">
            <p>{error || "Error: No valid product data provided."}</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const discount = ((product.originalPrice - product.discountPrice) / product.originalPrice * 100).toFixed(0);
  const rating = product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
    : "0";
  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://placehold.co/400x400/png", "https://placehold.co/400x400/png", "https://placehold.co/400x400/png", "https://placehold.co/400x400/png"];
  const specifications = [
    { name: "Brand", value: product.brandName || "N/A" },
    { name: "Model", value: product.productModel || "N/A" },
    { name: "Color", value: product.color || "N/A" },
    { name: "Weight", value: product.weight || "N/A" },
    { name: "Mobile", value: product.mobile || "N/A" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1000px] p-6" style={{ maxWidth: '1000px' }}>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{product.genericName}</DialogTitle>
          </VisuallyHidden>
          <DialogDescription>View product details, specifications, and reviews</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={productImages[selectedImage] || "https://placehold.co/400x400/png"}
                alt={`${product.genericName} - Main view`}
                width={400}
                height={400}
                style={{ width: '100%', height: 'auto' }}
                className="aspect-square object-cover rounded-md"
                loading="lazy"
                onError={(e) => {
                  console.error("ProductDetail - Image load error for main image:", productImages[selectedImage]);
                  e.currentTarget.src = "https://placehold.co/400x400/png";
                }}
              />
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>
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
                    alt={`${product.genericName} - View ${index + 1}`}
                    width={100}
                    height={100}
                    style={{ width: '100%', height: 'auto' }}
                    className="aspect-square object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error("ProductDetail - Image load error for thumbnail:", image);
                      e.currentTarget.src = "https://placehold.co/100x100/png";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{product.genericName}</h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="text-sm font-medium ml-1">{rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">${(product.discountPrice || 0).toFixed(2)}</span>
              <span className="text-lg text-muted-foreground line-through">${(product.originalPrice || 0).toFixed(2)}</span>
              <Badge className="bg-green-600 hover:bg-green-700">
                Save ${((product.originalPrice || 0) - (product.discountPrice || 0)).toFixed(2)}
              </Badge>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Tabs defaultValue="description">
              <TabsList className="w-full grid grid-cols-3 gap-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground">
                  {product.description || "No description available for this product."}
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
                    High-quality performance
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
                    Durable design
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
                    Easy to use
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
                          className={`h-5 w-5 ${star <= Math.floor(parseFloat(rating)) ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">Based on {product.reviews.length} reviews</span>
                  </div>
                  <div className="space-y-4">
                    {product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= (review.rating || 0) ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{(review.rating || 0)}/5</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{review.comment || "No comment provided."}</p>
                          <p className="text-xs text-muted-foreground mt-1">By {review.user || "Anonymous"}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No reviews available for this product.</p>
                    )}
                  </div>
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
                    disabled={quantity <= 1 || isLoading}
                    className="h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={isLoading}
                    className="h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 cursor-pointer"
                  size="lg"
                  disabled={isLoading}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isLoading ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="secondary"
                  size="lg"
                  disabled={isLoading}
                >
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleWishlist}
                  disabled={isLoading || wishlistLoading}
                  className={`h-11 w-11 transition-colors ${isWishlisted ? "text-red-500 border-red-500 hover:bg-red-50" : "hover:bg-gray-100"}`}
                >
                  <Heart className={`h-5 w-5 transition-transform ${isWishlisted ? "fill-red-500 scale-110" : ""}`} />
                  <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
                </Button>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Student Discount:</span> Verified students get an additional 10% off on this product.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}