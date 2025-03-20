// filepath: c:\Users\vedan\Desktop\pro2\app\about.tsx
export default function About() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        <header className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400">About Us</h1>
        </header>
        <main className="container mx-auto px-4 py-8">
          <p className="text-gray-800 dark:text-gray-200">
            This project leverages AWS Translate, Next.js, and Tailwind CSS to provide seamless language translation services.
          </p>
        </main>
      </div>
    )
  }