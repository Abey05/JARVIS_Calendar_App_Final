import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SettingsProps {
  username: string
}

const Settings: React.FC<SettingsProps> = ({ username }) => {
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedImage = localStorage.getItem(`jarvisProfile-${username}`)
    if (storedImage) {
      setImage(storedImage)
      setPreview(storedImage)
    }
  }, [username])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreview(base64)
        localStorage.setItem(`jarvisProfile-${username}`, base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGoBack = () => navigate('/calendar')

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

      <div className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-sm text-center">
        <h3 className="mb-4 text-lg font-semibold">Profile Picture</h3>
        <div className="flex flex-col items-center gap-3">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-600 flex items-center justify-center text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload New Picture
          </button>
        </div>
      </div>

      <button
        onClick={handleGoBack}
        className="mt-8 text-blue-400 underline hover:text-blue-300"
      >
        ← Back to Calendar
      </button>
    </div>
  )
}

export default Settings
