'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React, { ReactNode, MouseEvent } from 'react'

export interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  duration?: number
  blur?: boolean
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 30,
  duration = 0.6,
  blur = true
}: ScrollRevealProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance, x: 0 }
      case 'down': return { y: -distance, x: 0 }
      case 'left': return { x: distance, y: 0 }
      case 'right': return { x: -distance, y: 0 }
      case 'none': default: return { x: 0, y: 0 }
    }
  }

  const initialPos = getInitialPosition()

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initialPos,
        filter: blur ? 'blur(8px)' : 'none'
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)'
      }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.08,
  delayChildren = 0.1
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
  distance = 25
}: {
  children: ReactNode
  className?: string
  distance?: number
}) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: distance,
          filter: 'blur(6px)'
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Interactive Card with subtle 3D tilt and mouse spotlight effect
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(20, 184, 166, 0.15)',
  ...props
}: {
  children: ReactNode
  className?: string
  spotlightColor?: string
  [key: string]: any
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      {/* Dynamic Mouse Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`
          )
        }}
      />
      {children}
    </motion.div>
  )
}
