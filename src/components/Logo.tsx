import type React from "react"

const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 50 A30 30 0 0 1 50 20 V50 Z" fill="currentColor" />
      <path d="M50 50 L80 80" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
    </svg>
  )
}

export default Logo

