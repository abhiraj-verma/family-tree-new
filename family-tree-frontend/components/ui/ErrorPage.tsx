import { AlertCircle } from 'lucide-react'

interface ErrorPageProps {
  title: string
  message: string
  onGoHome: () => void
}

export default function ErrorPage({ title, message, onGoHome }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onGoHome}
          className="btn-primary"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}