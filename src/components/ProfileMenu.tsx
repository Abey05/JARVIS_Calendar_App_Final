import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

interface ProfileMenuProps {
  username: string
  onDeleteAccount: () => void
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ username, onDeleteAccount }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const storedImage = localStorage.getItem(`jarvisProfile-${username}`)
    if (storedImage) setProfileImage(storedImage)
  }, [username])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setMenuOpen(!menuOpen)}>
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-white"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-50">
          <Link
            to="/settings"
            className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-slate-700 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            ⚙️ Settings
          </Link>

          <button
            onClick={onDeleteAccount}
            className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
          >
            ❌ Delete Account
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
