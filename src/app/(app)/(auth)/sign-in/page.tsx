import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Manrope } from "next/font/google"
import { UserAuthForm } from "@/components/auth/user-auth-from"

const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sign In - Projectify",
  description: "Sign in to Projectify using your Google account.",
}

export default function AuthenticationPage() {
  return (
    <div className={`w-full min-h-screen bg-black text-white ${manrope.className}`}>
      <div className="container relative flex h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8 w-full max-w-md">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <Image src="/logo_white.png" alt="Projectify Logo" width={80} height={80} className="mx-auto mb-4" />
              <h1 className="text-3xl font-semibold tracking-tight">Welcome to Projectify</h1>
              <p className="text-muted-foreground">Sign in to start managing your projects efficiently</p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Projectify has revolutionized how we manage our projects. It's simple, intuitive, and incredibly
                powerful.&rdquo;
              </p>
              <footer className="text-sm">Hamza, Indie Hacker</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}

