"use client"

import { Manrope } from "next/font/google"
import { CheckCircle, Layout, Zap, Users, Calendar, FileText } from "lucide-react"

const manrope = Manrope({ subsets: ["latin"] })

const features = [
  { icon: CheckCircle, title: "Task Management", description: "Organize and prioritize your tasks effortlessly." },
  { icon: Layout, title: "Kanban Boards", description: "Visualize your workflow with customizable boards." },
  { icon: Zap, title: "Quick Actions", description: "Perform common actions with keyboard shortcuts." },
  { icon: Users, title: "Team Collaboration", description: "Work together seamlessly in real-time." },
  { icon: Calendar, title: "Calendar Integration", description: "Sync your tasks with your schedule." },
  { icon: FileText, title: "Documentation", description: "Keep all project-related information in one place." },
]

export default function Page() {
  return (
    <div className={`w-full bg-black text-white ${manrope.className}`}>
      <header className="fixed top-0 left-0 right-0 z-10 p-4 bg-black bg-opacity-50 backdrop-blur-md">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <img src="/logo_white.png" alt="Projectify Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold">Projectify</span>
          </div>
          <ul className="flex space-x-6">
            {["Home", "Features", "Pricing"].map((section) => (
              <li key={section}>
                <a href={`#${section.toLowerCase()}`} className="hover:text-gray-300">
                  {section}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        <section id="home" className="min-h-screen flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl font-bold mb-6">Everything You Need, <br /> Nothing You Don't</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              A minimalist project management tool for indie hackers and small teams who want to focus on getting things done.
            </p>
            <a href="#join-contact" className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300">
              Join Beta
            </a>
          </div>
        </section>

        <section id="features" className="min-h-screen flex items-center justify-center py-20 text-center px-4">
          <div>
            <h2 className="text-4xl font-bold mb-6">Simple by Design</h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto">Powerful features wrapped in a minimalist interface.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg">
                  <feature.icon className="w-12 h-12 mb-4 mx-auto text-blue-400" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="min-h-screen flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-4xl font-bold mb-6">Free During Beta</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Help us shape the future of Projectify.</p>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg max-w-md mx-auto">
              <span className="text-6xl font-bold">$0</span>
              <p className="text-gray-300 mb-6">per month during beta</p>
              <ul className="text-left mb-8">
                {["Unlimited projects", "All features included", "Priority support", "Early access to new features"].map((feature, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#join-contact" className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 block text-center">
                Join Beta
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black bg-opacity-50 text-center py-8">
        <p>&copy; 2025 Projectify. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">Currently in Beta</p>
      </footer>
    </div>
  )
}