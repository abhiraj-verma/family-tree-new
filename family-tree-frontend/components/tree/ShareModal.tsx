'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { X, Share2, Copy, Clock, Eye, Link } from 'lucide-react'

interface ShareModalProps {
  onClose: () => void
}

export default function ShareModal({ onClose }: ShareModalProps) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  
  // Generate share URL based on user token
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/family/${user?.token || 'demo-token'}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Share2 className="w-6 h-6 text-emerald-500" />
            <span>Share Family Tree</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Share Link */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Link className="w-5 h-5 text-blue-500" />
              <label className="text-sm font-medium text-gray-700">Public Share Link</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">How to Share</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Copy the share link and send it to family members</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Recipients can view the family tree without signing up</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>The link will expire in 30 days for security</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
            <button
              onClick={handleCopyLink}
              className="btn-primary"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}