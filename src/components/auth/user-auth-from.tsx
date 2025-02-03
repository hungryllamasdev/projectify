"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const googleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={googleSignIn}
        className="bg-white text-black hover:bg-gray-200 transition duration-300"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Sign in with Google
      </Button>
    </div>
  )
}

