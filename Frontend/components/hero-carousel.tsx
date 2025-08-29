"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const slides = [
  {
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/carousel-1.png",
    alt: "Student discount offers",
  },
  {
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/carousel-4.png",
    alt: "Premium subscriptions",
  },
  {
    image: "https://classyfyed.s3.us-east-1.amazonaws.com/carousel-3.png",
    alt: "Exclusive deals",
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [])

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative h-[60vh] overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <Image width={1200} height={600} src={slide.image} alt={slide.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-10 w-10 rounded-full bg-black/20 text-white hover:bg-black/40"
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${current === index ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrent(index)}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
