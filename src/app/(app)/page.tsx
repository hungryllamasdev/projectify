"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, BarChart2, Calendar, Kanban, FileText } from "lucide-react"
import Logo from "@/components/Logo"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <Link className="flex items-center space-x-2" href="/">
            <Logo className="h-8 w-8 text-black dark:text-white" />
            <span className="text-xl font-bold">Projectify</span>
          </Link>
          <nav className="flex items-center space-x-8">
            <Link
              className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              href="#features"
            >
              Features
            </Link>
            <Button size="sm" variant="outline">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero section */}
        <section className="w-full pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold text-sm">
                Now in Beta
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
                Simplify Your Projects with Projectify
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The easiest way to manage your projects. Perfect for solo creators and small teams.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <Link href="/sign-up">Get Started - It's Free</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="#features">See How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="w-full py-20 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need, Nothing You Don't
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Streamline your workflow with our intuitive features
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors w-full max-w-sm"
                >
                  <CardHeader className="space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="w-full py-20 bg-black text-white dark:bg-white dark:text-black">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to Simplify Your Projects?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join the beta and be among the first to experience the easiest project management tool.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white"
            >
              <Link href="/sign-up">Start Your Free Trial</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Projectify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: <Kanban className="h-6 w-6" />,
    title: "Kanban Board",
    description: "Visualize your workflow and move tasks effortlessly through different stages.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Calendar View",
    description: "Plan and schedule your tasks with an intuitive calendar interface.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Documentation",
    description: "Keep all your project-related documents and notes in one place.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Collaboration",
    description: "Share projects and collaborate seamlessly with team members.",
  },
  {
    icon: <BarChart2 className="h-6 w-6" />,
    title: "Simple Analytics",
    description: "Track your progress with easy-to-understand project analytics.",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Task Management",
    description: "Create, assign, and manage tasks with just a few clicks.",
  },
]

