"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  loading: boolean
  updateProfile: (data: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fake API - simulates real API behavior
const FAKE_USERS = [
  {
    id: "1",
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    avatar: "/images/profile-avatar.png",
    bio: "Full-stack developer and technical writer",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
  },
  {
    id: "2",
    email: "jane@example.com",
    password: "password123",
    name: "Jane Smith",
    avatar: "/images/profile-avatar.png",
    bio: "Frontend developer and UI/UX designer",
    location: "New York, NY",
    website: "https://janesmith.dev",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = FAKE_USERS.find((u) => u.email === email && u.password === password)

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        const token = `fake_token_${Date.now()}`

        localStorage.setItem("auth_token", token)
        localStorage.setItem("user_data", JSON.stringify(userWithoutPassword))
        setUser(userWithoutPassword)

        return { success: true }
      } else {
        return { success: false, message: "Invalid email or password" }
      }
    } catch (error) {
      return { success: false, message: "Network error occurred" }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUser = FAKE_USERS.find((u) => u.email === email)
      if (existingUser) {
        return { success: false, message: "User with this email already exists" }
      }

      // Create new user
      const newUser = {
        id: `${Date.now()}`,
        email,
        name,
        avatar: "/images/profile-avatar.png",
        bio: "",
        location: "",
        website: "",
      }

      const token = `fake_token_${Date.now()}`

      // Add to fake users array (in real app this would be saved to database)
      FAKE_USERS.push({ ...newUser, password })

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(newUser))
      setUser(newUser)

      return { success: true }
    } catch (error) {
      return { success: false, message: "Network error occurred" }
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (user) {
        const updatedUser = { ...user, ...profileData }
        localStorage.setItem("user_data", JSON.stringify(updatedUser))
        setUser(updatedUser)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
