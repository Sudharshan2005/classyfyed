"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FeaturedCategories from "@/components/featured-categories"
import FlashDeals from "@/components/flash-deals"
import Image from "next/image"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <Carousel3D />
        </section>

        <section className="py-12 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Personalized Recommendations</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Top Picks For You</h3>
                <p className="text-muted-foreground">
                  Curated products based on your academic interests and previous purchases
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 2v8" />
                    <path d="m4.93 10.93 1.41 1.41" />
                    <path d="M2 18h2" />
                    <path d="M20 18h2" />
                    <path d="m19.07 10.93-1.41 1.41" />
                    <path d="M22 22H2" />
                    <path d="m16 6-4 4-4-4" />
                    <path d="M16 18a4 4 0 0 0-8 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upcoming Deals</h3>
                <p className="text-muted-foreground">
                  Get notified about exclusive deals and flash sales for your semester needs
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
                <p className="text-muted-foreground">
                  Access exclusive educational content and resources for your courses
                </p>
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
            <Tabs defaultValue="deals">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="deals">Flash Deals</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
                </TabsList>
                <Link
                  href="/collections/flash-deals"
                  className="text-primary font-medium hover:underline flex items-center"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <TabsContent value="deals">
                <FlashDeals />
              </TabsContent>
              <TabsContent value="trending">
                <FlashDeals />
              </TabsContent>
              <TabsContent value="recent">
                <FlashDeals />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6 bg-primary text-primary-foreground">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Student Success Stories</h2>
                <div className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary-foreground flex items-center justify-center text-primary font-bold mr-3">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Aisha K.</p>
                        <p className="text-sm opacity-80">Computer Science, Delhi University</p>
                      </div>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="italic">
                      &quot;The student verification process was seamless, and I saved over ₹15,000 on my laptop purchase.
                      Highly recommend to all students!&quot;
                    </p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary-foreground flex items-center justify-center text-primary font-bold mr-3">
                        R
                      </div>
                      <div>
                        <p className="font-medium">Rahul M.</p>
                        <p className="text-sm opacity-80">Engineering, IIT Bombay</p>
                      </div>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="italic">
                      &quot;The software subscriptions available here saved me thousands of rupees. The premium plan is worth
                      every penny for the additional discounts!&quot;
                    </p>
                  </div>
                </div>
                <Button size="lg" asChild className="mt-6 bg-white text-primary hover:bg-white/90">
                  <Link href="/subscriptions">Upgrade Your Plan</Link>
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Students enjoying discounts"
                  className="w-full h-auto object-cover"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Upcoming Campus Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Tech Expo 2023"
                      className="w-full h-48 object-cover"
                      width={400}
                      height={200}
                    />
                    <Badge className="absolute top-2 right-2">Next Week</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Tech Expo 2023</h3>
                    <p className="text-muted-foreground mb-4">
                      Exclusive discounts on the latest gadgets for students attending the expo.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">June 15-16, 2023</span>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Book Fair"
                      className="w-full h-48 object-cover"
                      width={400}
                      height={200}
                    />
                    <Badge className="absolute top-2 right-2">This Month</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">National Book Fair</h3>
                    <p className="text-muted-foreground mb-4">
                      Special student discounts on textbooks and academic resources.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">June 20-25, 2023</span>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src="/placeholder.svg?height=200&width=400"
                      alt="Career Fair"
                      className="w-full h-48 object-cover"
                      height={200}
                      width={400}
                    />
                    <Badge className="absolute top-2 right-2">Coming Soon</Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">Career Fair 2023</h3>
                    <p className="text-muted-foreground mb-4">
                      Discounted professional attire and resume services for graduating students.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">July 5-7, 2023</span>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Carousel3D() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const totalSlides = 5

  const slides = [
    {
      image: "https://placehold.co/1200x600",
      alt: "Premium electronics with student discounts",
    },
    {
      image: "https://placehold.co/1200x600",
      alt: "Exclusive software subscriptions",
    },
    {
      image: "https://placehold.co/1200x600",
      alt: "Academic textbooks and resources",
    },
    {
      image: "https://placehold.co/1200x600",
      alt: "Campus lifestyle essentials",
    },
    {
      image: "https://placehold.co/1200x600",
      alt: "Professional development tools",
    },
  ]

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, totalSlides])

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentSlide, isAnimating, nextSlide])

  const getSlideStyle = (index: number) => {
    // Calculate the position of each slide in the 3D carousel
    const diff = (index - currentSlide + totalSlides) % totalSlides
    let rotateY = 0
    let translateZ = 0
    let opacity = 0
    let zIndex = 0

    if (diff === 0) {
      // Current slide
      rotateY = 0
      translateZ = 0
      opacity = 1
      zIndex = totalSlides
    } else if (diff === 1 || diff === totalSlides - 1) {
      // Adjacent slides
      rotateY = diff === 1 ? 45 : -45
      translateZ = -150
      opacity = 0.7
      zIndex = totalSlides - 1
    } else {
      // Other slides
      rotateY = diff === 2 ? 90 : -90
      translateZ = -300
      opacity = 0.3
      zIndex = totalSlides - 2
    }

    return {
      transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      opacity,
      zIndex,
      transition: "all 0.5s ease-in-out",
    }
  }

  return (
    <div className="relative h-[60vh] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 perspective">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full preserve-3d">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              style={getSlideStyle(index)}
            >
              <div className="relative w-[80%] h-[80%] rounded-lg overflow-hidden shadow-2xl transform-style-3d">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  width={1200}
                  height={600}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-10">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                currentSlide === index ? "bg-white w-4" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  )
}
