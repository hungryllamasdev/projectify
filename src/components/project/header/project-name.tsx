'use client'

import { useState, useRef, useEffect } from 'react'
import { Pencil } from 'lucide-react'

interface ProjectNameProps {
  initialName: string
  onChange: (newName: string) => void
}

export function ProjectName({ initialName, onChange }: ProjectNameProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  const handleBlur = () => {
    setIsEditing(false)
    if (name !== initialName) {
      onChange(name)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  return (
    <div className="group relative">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full rounded-md border-gray-300 text-2xl font-bold focus:border-blue-500 focus:ring-blue-500"
        />
      ) : (
        <h1
          onClick={() => setIsEditing(true)}
          className="text-2xl font-bold group-hover:cursor-text"
        >
          {name}
        </h1>
      )}
      {!isEditing && (
        <Pencil
          className="absolute -right-6 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-gray-400 group-hover:block"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  )
}

