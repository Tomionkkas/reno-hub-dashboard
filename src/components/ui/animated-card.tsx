
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: 'lift' | 'glow' | 'scale' | 'none'
  delay?: number
  children: React.ReactNode
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, hover = 'lift', delay = 0, children, ...props }, ref) => {
    const hoverClasses = {
      lift: 'card-hover',
      glow: 'hover-glow transition-all duration-300',
      scale: 'hover:scale-105 transition-transform duration-300',
      none: ''
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "animate-fade-in-up",
          hoverClasses[hover],
          className
        )}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      >
        {children}
      </Card>
    )
  }
)
AnimatedCard.displayName = "AnimatedCard"

const AnimatedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn("animate-slide-in-left", className)}
    {...props}
  />
))
AnimatedCardHeader.displayName = "AnimatedCardHeader"

const AnimatedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn("animate-fade-in", className)}
    {...props}
  />
))
AnimatedCardTitle.displayName = "AnimatedCardTitle"

const AnimatedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn("animate-fade-in", className)}
    style={{ animationDelay: '200ms' }}
    {...props}
  />
))
AnimatedCardDescription.displayName = "AnimatedCardDescription"

const AnimatedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("animate-slide-in-right", className)}
    {...props}
  />
))
AnimatedCardContent.displayName = "AnimatedCardContent"

const AnimatedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn("animate-fade-in", className)}
    style={{ animationDelay: '300ms' }}
    {...props}
  />
))
AnimatedCardFooter.displayName = "AnimatedCardFooter"

export { 
  AnimatedCard, 
  AnimatedCardHeader, 
  AnimatedCardFooter,
  AnimatedCardTitle, 
  AnimatedCardDescription, 
  AnimatedCardContent 
}
