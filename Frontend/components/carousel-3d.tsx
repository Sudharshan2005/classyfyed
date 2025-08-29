import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Carousel3D() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const slides = [
      {
        image: "https://classyfyed.s3.us-east-1.amazonaws.com/carousel-1.png",
        alt: "Premium electronics with student discounts",
      },
      {
        image: "https://classyfyed.s3.us-east-1.amazonaws.com/carousel-2.png",
        alt: "Exclusive software subscriptions",
      },
      {
        image: "https://classyfyed.s3.us-east-1.amazonaws.com/carousel-3.png",
        alt: "Academic textbooks and resources",
      },
      {
        image: "https://classyfyed.s3.us-east-1.amazonaws.com/carousel-4.png",
        alt: "Campus lifestyle essentials",
      },
    ]
    const totalSlides = slides.length

  
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
      let translateX = 0
      let opacity = 0
      let zIndex = 0
  
      if (index === currentSlide) {
        translateX = 0
        opacity = 1
        zIndex = 10
      } else if (index === (currentSlide + 1) % totalSlides) {
        translateX = 100
        opacity = 0
        zIndex = 5
      } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
        translateX = -100
        opacity = 0
        zIndex = 5
      } else {
        translateX = 100
        opacity = 0
        zIndex = 0
      }
  
      return {
        transform: `translateX(${translateX}%)`,
        opacity,
        zIndex,
        transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
      }
    }
  
    return (
      <div className="relative h-[60vh] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full preserve-3d">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={getSlideStyle(index)}
              >
                <div className="relative w-[80%] h-[80%] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.alt}
                    className="w-full h-full object-cover duration-500 hover:scale-105"
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
