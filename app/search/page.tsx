"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  excerpt: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  publishedAt: string
  category: string
  tags: string[]
  likes: number
  comments: number
  isLiked: boolean
  image: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(!!searchParams.get("q"))

  // Get the primitive value once per render
  const queryString = searchParams.get("q") || ""

  /**
   * Run search every time the *string* in the URL changes.
   * This avoids the infinite loop caused by a new URLSearchParams
   * object being created on each render.
   */
  useEffect(() => {
    if (queryString) {
      setSearchQuery(queryString)
      performSearch(queryString)
    } else {
      setPosts([])
      setHasSearched(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    setHasSearched(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock search results - return results only for "Frontend Development"
      if (query.toLowerCase().includes("frontend development")) {
        const mockResults: Post[] = [
          {
            id: "1",
            title: "5 Reasons to Learn Frontend Development in 2025",
            excerpt:
              "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible...",
            author: {
              id: "1",
              name: "John Doe",
              avatar: "/images/profile-avatar.png",
            },
            publishedAt: "2025-05-27T10:00:00Z",
            category: "Programming",
            tags: ["Programming", "Frontend", "Coding"],
            likes: 20,
            comments: 20,
            isLiked: false,
            image: "/images/laptop-workspace.png",
          },
        ]
        setPosts(mockResults)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Search failed:", error)
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/post/${post.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3 line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="blog-tag text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <Link
              href={`/profile/${post.author.id}`}
              className="flex items-center space-x-3 hover:text-blue-600 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{post.author.name}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-400">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleLike(post.id)}
                className={`blog-engagement ${post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                <span>{post.likes}</span>
              </button>
              <div className="blog-engagement">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="blog-container py-8">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </form>
        </div>

        {/* Search Results */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          posts.length > 0 ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Result for "{searchQuery}"</h1>
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-24 h-24 mb-6">
                <img
                  src="/images/no-results-icon.png"
                  alt="No results found"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">Try using different keywords</p>
              <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-600">Enter keywords to search for articles</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">© 2025 Web Programming Hack Blog All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
