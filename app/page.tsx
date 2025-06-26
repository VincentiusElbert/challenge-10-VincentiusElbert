"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"

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

export default function HomePage() {
  const { user } = useAuth()
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([])
  const [mostLikedPosts, setMostLikedPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(2)
  const [totalPages] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      // Mock data matching the Figma design
      const mockRecommendedPosts: Post[] = [
        {
          id: "1",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt:
            "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, access...",
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
        {
          id: "2",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt:
            "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, access...",
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
        {
          id: "3",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt:
            "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, access...",
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
        {
          id: "4",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt:
            "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, access...",
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
        {
          id: "5",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt:
            "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, access...",
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

      const mockMostLikedPosts: Post[] = [
        {
          id: "6",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt: "Frontend development is more than just building beautiful user interfaces — it's about...",
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
        {
          id: "7",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt: "Frontend development is more than just building beautiful user interfaces — it's about...",
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
        {
          id: "8",
          title: "5 Reasons to Learn Frontend Development in 2025",
          excerpt: "Frontend development is more than just building beautiful user interfaces — it's about...",
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

      setRecommendedPosts(mockRecommendedPosts)
      setMostLikedPosts(mockMostLikedPosts)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string, isRecommended: boolean) => {
    if (isRecommended) {
      setRecommendedPosts(
        recommendedPosts.map((post) =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
            : post,
        ),
      )
    } else {
      setMostLikedPosts(
        mostLikedPosts.map((post) =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
            : post,
        ),
      )
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Here you would typically fetch new data for the selected page
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="ghost"
        size="sm"
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center space-x-1 text-gray-600"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>,
    )

    // Page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            currentPage === i ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>,
      )
    }

    // Add ellipsis if needed
    if (endPage < totalPages) {
      pages.push(
        <span key="ellipsis" className="text-gray-400 px-2">
          ...
        </span>,
      )
    }

    // Next button
    pages.push(
      <Button
        key="next"
        variant="ghost"
        size="sm"
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center space-x-1 text-gray-600"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>,
    )

    return pages
  }

  const PostCard = ({ post, isRecommended = true }: { post: Post; isRecommended?: boolean }) => (
    <div className="bg-white border-b border-gray-100 pb-6 mb-6">
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
                onClick={() => handleLike(post.id, isRecommended)}
                className={`flex items-center space-x-1 transition-colors ${
                  post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{post.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-100 pb-6">
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
            </div>
            <div className="space-y-4">
              <div className="animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommend For You Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommend For You</h2>
            <div>
              {recommendedPosts.map((post) => (
                <PostCard key={post.id} post={post} isRecommended={true} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 mt-8">{renderPagination()}</div>
          </div>

          {/* Most Liked Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Liked</h2>
            <div className="space-y-4">
              {mostLikedPosts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <Link href={`/post/${post.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id, false)}
                      className={`flex items-center space-x-1 transition-colors ${
                        post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">© 2025 Web Programming Hack Blog All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
