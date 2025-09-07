// src/components/common/ParticleBackground/ParticleBackground.jsx
import React, { useEffect, useRef } from 'react'
import './ParticleBackground.css'

const ParticleBackground = () => {
  const canvasRef = useRef(null)
  const particlesArrayRef = useRef([])
  const mouseRef = useRef({ x: null, y: null })
  const animationRef = useRef(null)
  const hueRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()

    const handleResize = () => {
      setCanvasSize()
    }

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.x
      mouseRef.current.y = event.y

      // Create particles on move
      for (let i = 0; i < 3; i++) {
        particlesArrayRef.current.push(new Particle())
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = null
      mouseRef.current.y = null
    }

    const handleClick = (event) => {
      mouseRef.current.x = event.x
      mouseRef.current.y = event.y

      // Create explosion of particles on click
      for (let i = 0; i < 15; i++) {
        particlesArrayRef.current.push(new Particle())
      }
    }

    class Particle {
      constructor() {
        this.x = mouseRef.current.x
        this.y = mouseRef.current.y
        this.size = Math.random() * 12 + 3
        this.speedX = Math.random() * 5 - 2.5
        this.speedY = Math.random() * 5 - 2.5
        this.color = `hsl(${hueRef.current}, 100%, 60%)`
        this.alpha = 1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.3) this.size -= 0.2
        if (this.alpha > 0.01) this.alpha -= 0.01
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const animate = () => {
      // Clear with a slight transparency for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create particles even when mouse is not moving
      if (mouseRef.current.x && mouseRef.current.y && Math.random() < 0.3) {
        particlesArrayRef.current.push(new Particle())
      }

      // Update and draw particles
      for (let i = 0; i < particlesArrayRef.current.length; i++) {
        particlesArrayRef.current[i].update()
        particlesArrayRef.current[i].draw()

        // Remove particles that are too small or transparent
        if (
          particlesArrayRef.current[i].size <= 0.3 ||
          particlesArrayRef.current[i].alpha <= 0.01
        ) {
          particlesArrayRef.current.splice(i, 1)
          i--
        }
      }

      // Slowly change hue
      hueRef.current += 0.5
      if (hueRef.current > 360) hueRef.current = 0

      animationRef.current = requestAnimationFrame(animate)
    }

    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

export default ParticleBackground
