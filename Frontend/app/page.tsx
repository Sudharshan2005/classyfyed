"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle2, Store, TrendingUp, Users, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import HeroCarousel from "@/components/hero-carousel"
import FeaturedCategories from "@/components/featured-categories"
import FlashDeals from "@/components/flash-deals"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"

export default function Home() {
  const router = useRouter()

  interface HandleProtectedLinkEvent {
    preventDefault: () => void;
  }

  const handleProtectedLink = (e: HandleProtectedLinkEvent, href: string): void => {
    const exemptRoutes: string[] = ["/about", "/contact", "/auth/login"];
    if (exemptRoutes.includes(href)) {
      return; // Allow navigation without token check
    }

    const token: string | null = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      console.log("Home - No JWT token, redirecting to /auth/login");
      router.push("/auth/login");
    }
    // If token exists, navigation proceeds normally via Link
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative">
          <HeroCarousel />
          <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4 bg-black/40 text-white p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-center max-w-4xl">
              Exclusive Discounts for Verified Students
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl">
              Join thousands of students saving on products and subscriptions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/register" onClick={(e) => handleProtectedLink(e, "/auth/register")}>
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border-white"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Register & Verify</h3>
                <p className="text-muted-foreground">
                  Sign up with your institute details and verify your student status
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Discounts</h3>
                <p className="text-muted-foreground">Explore exclusive discounts on products and subscriptions</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Save & Enjoy</h3>
                <p className="text-muted-foreground">Purchase with verified student discounts and save money</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">Popular Categories</h2>
            <p className="text-center text-muted-foreground mb-8">Discover discounts across various categories</p>
            <FeaturedCategories />
          </div>
        </section>

        <section className="py-12 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Flash Deals</h2>
              <Link
                href="/collections/flash-deals"
                onClick={(e) => handleProtectedLink(e, "/collections/flash-deals")}
                className="text-primary font-medium hover:underline flex items-center"
              >
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <FlashDeals />
          </div>
        </section>

        <section className="py-12 px-4 md:px-6 bg-primary text-primary-foreground">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Why Choose StudentDiscount?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Verified student-only discounts on premium products</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Exclusive subscription offers from top brands</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Multi-vendor marketplace with quality assurance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 mr-2 flex-shrink-0" />
                    <span>Secure verification process for genuine students</span>
                  </li>
                </ul>
                <Button size="lg" asChild className="mt-6 bg-white text-primary hover:bg-white/90">
                  <Link href="/auth/register" onClick={(e) => handleProtectedLink(e, "/auth/register")}>
                    Join Now
                  </Link>
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://placehold.co/400x400/png"
                  alt="Students shopping with discounts"
                  className="w-full h-auto object-cover"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* New Vendor Section */}
        <section className="py-12 px-4 md:px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Become a Vendor Partner</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with thousands of verified students and grow your business by offering exclusive student discounts on our platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Access Student Market</h3>
                <p className="text-muted-foreground">
                  Tap into our growing community of verified students eager for discounted products and services
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Boost Brand Loyalty</h3>
                <p className="text-muted-foreground">
                  Create lifelong customers by engaging students early with special offers and discounts
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Store className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Storefront Setup</h3>
                <p className="text-muted-foreground">
                  Launch your branded storefront quickly with our intuitive vendor dashboard and product tools
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  Benefit from our safe payment processing system and streamlined order fulfillment
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg mx-auto max-w-2xl">
              <div className="grid md:grid-cols-2 gap-9 items-center justify-around">
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Partner With Us Today</h3>
                  <p className="mb-6 text-muted-foreground">
                    Join our marketplace of trusted vendors and connect with verified students across the country. Our vendor program features competitive commission rates, powerful analytics, and dedicated support.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                      <Link href="/vendor/register" onClick={(e) => handleProtectedLink(e, "/vendor/register")}>
                        Become a Vendor <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
                      <Link href="/vendors/learn-more" onClick={(e) => handleProtectedLink(e, "/vendors/learn-more")}>
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="relative h-64 rounded-lg ml-auto mr-6 overflow-hidden">
                  <Image
                    src="https://placehold.co/100x100/png"
                    alt="Students shopping with discounts"
                    className="object-cover rounded-lg"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}