import * as React from "react"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps extends Omit<React.HTMLProps<HTMLElement>, "as"> {
  as?: React.ElementType
}

const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ className, as: Component = "span", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("sr-only", className)}
        {...props}
      />
    )
  }
)
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }