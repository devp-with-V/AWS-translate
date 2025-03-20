import TranslationService from "@/components/translation-service"
import { Github } from "lucide-react"
import Link from "next/link" // Import Link for navigation

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">AWS Translation Service</h1>
          <nav className="flex items-center gap-6">
            <Link href="./team/page.tsx" className="text-sm text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400">
                Team
            </Link>
            <Link href="./about/page.tsx" className="text-sm text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400">
                About
            </Link>
            <a
              href="https://github.com/devp-with-V"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                Cloud-Based Language Translation
              </h2>
              <TranslationService />
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 mt-12">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Cloud Computing Project - Built with AWS Translate, Next.js, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  )
}