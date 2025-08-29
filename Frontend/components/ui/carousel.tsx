"use client"

import { useState, useEffect, useCallback } from "react"
import { IconArrowNarrowRight } from "@tabler/icons-react"
import Image from "next/image"

interface SlideData {
  title: string
  button: string
  src: string
}

interface SlideProps {
  slide: SlideData
  index: number
  current: number
}

const Slide = ({ slide, index, current }: SlideProps) => {
  const { src, button, title } = slide

  return (
    <li
      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
        current === index ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          className="object-cover"
          alt={title}
          src={src}
          fill
          priority={index === 0}
          onError={() => console.error(`Failed to load image: ${src}`)}
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold mb-4">{title}</h2>
          <button className="px-4 py-2 bg-white text-black rounded-2xl hover:shadow-lg transition duration-200 flex items-center gap-2">
            {button}
            <IconArrowNarrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </li>
  )
}

interface CarouselControlProps {
  type: string
  title: string
  handleClick: () => void
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
      aria-label={title}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  )
}

interface CarouselProps {
  slides: SlideData[]
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0)

  const handlePreviousClick = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [slides.length])

  const handleNextClick = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [slides.length])

  useEffect(() => {
    const interval = setInterval(handleNextClick, 5000)
    return () => clearInterval(interval)
  }, [handleNextClick])

  return (
    <div className="relative w-full h-full">
      <ul className="relative w-full h-full">
        {slides.map((slide, index) => (
          <Slide key={index} slide={slide} index={index} current={current} />
        ))}
      </ul>

      <div className="absolute inset-0 flex items-center justify-between p-4 z-20">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              current === index ? "bg-white w-6" : "bg-white/50 w-2"
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}