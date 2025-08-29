"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import ProductDetail from "@/components/product-detail"
import { useToast } from "@/hooks/use-toast"

interface IVariant {
  key: string;
  value: string;
}

interface IReview {
  rating: number;
  comment: string;
  user: string;
}

interface IProduct {
  _id: string;
  images: string[];
  brandName: string;
  mobile: string;
  genericName: string;
  originalPrice: number;
  discountPrice: number;
  category: string;
  subCategory: string;
  stock: number;
  sales: number;
  productModel?: string;
  color?: string;
  weight?: string;
  variants: IVariant[];
  description?: string;
  reviews: IReview[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

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

export default function WishlistPage() {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{
    _id: string;
    images: string[];
    brandName: string;
    mobile: string;
    genericName: string;
    originalPrice: number;
    discountPrice: number;
    reviews: IReview[];
    productModel?: string;
    href: string;
    color?: string;
    weight?: string;
    description?: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        description: "Please log in to view your wishlist.",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!email) return;

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/wishlist/fetch?email=${encodeURIComponent(email)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success && data.wishlist) {
          setWishlistItems(data.wishlist.products || []);
        } else {
          setError(data.error || "Failed to load wishlist.");
          toast({
            variant: "destructive",
            title: "Error",
            description: data.error || "Failed to load wishlist.",
          });
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("An error occurred while fetching wishlist.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load wishlist.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [email, toast]);

  const removeFromWishlist = async (_id: string) => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to update your wishlist.",
      });
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productId: _id,
          action: "remove",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWishlistItems(wishlistItems.filter((item) => item._id !== _id));
        toast({
          title: "Success",
          description: "Product removed from wishlist!",
        });
      } else {
        setError(data.error || "Failed to remove product from wishlist.");
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to remove product from wishlist.",
        });
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError("An error occurred while removing from wishlist.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove product from wishlist.",
      });
    }
  };

  const openProductDetail = (product: IProduct) => {
    setSelectedProduct({
      _id: product._id,
      images: product.images,
      brandName: product.brandName,
      mobile: product.mobile,
      genericName: product.genericName,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      reviews: product.reviews,
      productModel: product.productModel,
      href: `/product/${product._id}`,
      color: product.color,
      weight: product.weight,
      description: product.description,
    });
    setIsDialogOpen(true);
  };

  const getAverageRating = (reviews: IReview[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return Number((total / reviews.length).toFixed(1));
  };

  const getDiscountPercentage = (originalPrice: number, discountPrice: number) => {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  return (
    <div className="flex min-h-screen flex-col text-blue-950">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-950">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold ml-auto text-blue-950">Your Wishlist</h1>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              <p className="mt-4 text-muted-foreground">Loading your wishlist...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Error Loading Wishlist</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <Button className="bg-blue-950 hover:bg-blue-800" asChild>
                <Link href="/collections">Start Shopping</Link>
              </Button>
            </div>
          ) : wishlistItems.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item._id} className="overflow-hidden border rounded-lg hover:shadow-md transition-shadow">
                    <div className="relative">
                      <Image
                        src={item.images[0] || "https://placehold.co/300x300/png"}
                        alt={item.genericName}
                        width={300}
                        height={300}
                        className="w-full aspect-square object-cover cursor-pointer"
                        onClick={() => openProductDetail(item)}
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/300x300/png";
                        }}
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => removeFromWishlist(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove from wishlist</span>
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-semibold text-sm line-clamp-2 mb-2 cursor-pointer hover:text-primary text-blue-950"
                        onClick={() => openProductDetail(item)}
                      >
                        {item.brandName} {item.genericName}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-blue-950">${(item.discountPrice || 0).toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground line-through">${(item.originalPrice || 0).toFixed(2)}</span>
                        <span className="text-sm text-blue-800">
                          {getDiscountPercentage(item.originalPrice || 0, item.discountPrice || 0)}% off
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {getAverageRating(item.reviews)} ★ ({item.reviews?.length || 0} reviews)
                      </div>
                      <Button
                        className="w-full bg-blue-950 hover:bg-blue-800"
                        size="sm"
                        disabled={item.stock === 0}
                        onClick={() => {
                          openProductDetail(item)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
              <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
              <p className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added any products to your wishlist yet.
              </p>
              <Button className="bg-blue-950 hover:bg-blue-800" asChild>
                <Link href="/collections">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[1000px] p-6">
        <DialogTitle>
          Product Details:
        </DialogTitle>
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}