"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Award,
  Check,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { IProduct } from "@/models/Product";
import { Skeleton } from "@/components/ui/skeleton";

const relatedProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 599,
    originalPrice: 899,
    image: "/white-t-shirt.png",
    rating: 4.3,
    reviews: 156,
  },
  {
    id: 2,
    name: "Casual Chino Pants",
    price: 1299,
    originalPrice: 1799,
    image: "/chino-pants.png",
    rating: 4.1,
    reviews: 89,
  },
  {
    id: 3,
    name: "Leather Sneakers",
    price: 2199,
    originalPrice: 2999,
    image: "/leather-sneakers.png",
    rating: 4.5,
    reviews: 234,
  },
  {
    id: 4,
    name: "Cotton Hoodie",
    price: 1599,
    originalPrice: 2199,
    image: "/cotton-hoodie.png",
    rating: 4.2,
    reviews: 178,
  },
];

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage(props: Props) {
  const params = use(props.params);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<{ available: boolean; estimatedDays: string; charges: number } | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      if (typeof params.id === "string") {
        setResolvedParams({ id: params.id });
      }
    }
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      const fetchProducts = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/product/id/${resolvedParams.id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.statusText}`);
          }
          const data: IProduct = await response.json();
          setProduct(data);
          setError(null);
        } catch (error) {
          console.error("Error fetching product:", error);
          setError("Failed to load product details. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [resolvedParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="w-full aspect-square rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error || "Product not found"}</p>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="/collections">Back to Collections</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryInfo({
        available: true,
        estimatedDays: "2-3",
        charges: 0,
      });
    }
  };

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    console.log("Added to cart:", { product: product._id, size: selectedSize, quantity });
  };

  const addToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist toggled:", !isWishlisted);
  };

  const submitReview = () => {
    console.log("Review submitted:", newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 text-blue-950">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-blue-950">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-foreground">
                Collections
              </Link>
              <span>/</span>
              <Link href={`/collections/${product.category}`} className="hover:text-foreground capitalize">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.genericName}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <Image
                  width={400}
                  height={400}
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.genericName}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm"
                  onClick={addToWishlist}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md border-2 overflow-hidden ${
                      selectedImage === index ? "border-primary" : "border-muted"
                    }`}
                  >
                    <Image
                      width={100}
                      height={100}
                      src={image || "/placeholder.svg"}
                      alt={`${product.genericName} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{product.brandName || "Unknown Brand"}</p>
                <h1 className="text-3xl font-bold mb-2">{product.genericName}</h1>
                <p className="text-muted-foreground mb-4">{product.productModel || "N/A"}</p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">({product.reviews.length} reviews)</span>
                  {product.status === "active" && (
                    <Badge variant="secondary" className="ml-2">
                      <Award className="h-3 w-3 mr-1" />
                      Active Product
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold">₹{product.discountPrice.toLocaleString()}</span>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    {discountPercentage}% OFF
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">
                    Student Special: Extra 5% off with student verification
                  </span>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Size</Label>
                <div className="flex gap-2">
                  {product.variants
                    .filter((variant) => variant.key === "Size")
                    .map((variant, index) => (
                      <Button
                        key={index}
                        variant={selectedSize === variant.value ? "default" : "outline"}
                        onClick={() => setSelectedSize(variant.value)}
                        className="w-12 h-12"
                      >
                        {variant.value}
                      </Button>
                    ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <Label className="text-base font-medium mb-3 block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock} items available</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={addToCart} className="w-full h-12 text-base bg-blue-950 hover:bg-blue-800">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={addToWishlist} className="w-full h-12 text-base bg-transparent">
                  <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Delivery Check */}
              <Card className="text-blue-950">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">Delivery Options</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                    />
                    <Button onClick={checkDelivery} variant="outline">
                      Check
                    </Button>
                  </div>
                  {deliveryInfo && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md">
                      <div className="flex items-center gap-2 text-green-700">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">
                          Delivery available in {deliveryInfo.estimatedDays} business days
                          {deliveryInfo.charges === 0 ? " (Free delivery)" : ` (₹${deliveryInfo.charges})`}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-xs text-muted-foreground">Secure Payment</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                </div>
                <div className="text-center">
                  <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-xs text-muted-foreground">Quality Assured</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-12 text-blue-950">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card className="text-blue-950">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground mb-6">{product.description || "No description available."}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card className="text-blue-950">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Product Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Brand</span>
                      <span className="text-muted-foreground">{product.brandName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Model</span>
                      <span className="text-muted-foreground">{product.productModel || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Category</span>
                      <span className="text-muted-foreground">{product.category || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Subcategory</span>
                      <span className="text-muted-foreground">{product.subCategory || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Color</span>
                      <span className="text-muted-foreground">{product.color || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Weight</span>
                      <span className="text-muted-foreground">{product.weight || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Stock</span>
                      <span className="text-muted-foreground">{product.stock}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Sales</span>
                      <span className="text-muted-foreground">{product.sales}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Status</span>
                      <span className="text-muted-foreground">{product.status}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Vendor Contact</span>
                      <span className="text-muted-foreground">{product.mobile || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <Card className="text-blue-950">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold">Customer Reviews</h3>
                      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Write a Review</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Rating</Label>
                              <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-6 w-6 cursor-pointer ${
                                      star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label>Review</Label>
                              <Textarea
                                placeholder="Share your experience with this product..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="mt-2"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={submitReview} className="flex-1">
                                Submit Review
                              </Button>
                              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">{product.reviews.length} reviews</div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = product.reviews.filter((r) => r.rating === rating).length;
                          const percentage = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-2 mb-1">
                              <span className="text-sm w-8">{rating}★</span>
                              <Progress value={percentage} className="flex-1 h-2" />
                              <span className="text-sm text-muted-foreground w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {product.reviews.length > 0 ? (
                        product.reviews.map((review, index) => (
                          <div key={index} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{review.user || "Anonymous"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-3">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              <Card className="text-blue-950">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Questions & Answers</h3>
                    <Button variant="outline">Ask a Question</Button>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions yet. Be the first to ask!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square mb-4 overflow-hidden rounded-md">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="font-medium mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{product.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}