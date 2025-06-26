"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Globe, Calendar, Heart, MessageCircle, Eye } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  joinedAt: string
  followers: number
  following: number
  postsCount: number
}

interface UserPost {
  id: string
  title: string
  excerpt: string
  publishedAt: string
  category: string
  views: number
  likes: number
  comments: number
  isLiked: boolean
}

export default function VisitProfilePage() {
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<UserPost[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  const mockUser: User = {
    id: "1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=128&width=128",
    bio: "Full-stack developer and technical writer with 5+ years of experience in React and Next.js. Passionate about sharing knowledge and helping others learn modern web development.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    joinedAt: "2023-01-15",
    followers: 1250,
    following: 340,
    postsCount: 12,
  }

  const mockUserPosts: UserPost[] = [
    {
      id: "1",
      title: "Getting Started with Next.js 14: The Complete Guide",
      excerpt:
        "Learn how to build modern web applications with the latest features of Next.js 14, including App Router, Server Components, and more.",
      publishedAt: "2024-01-15",
      category: "Technology",
      views: 1250,
      likes: 42,
      comments: 12,
      isLiked: false,
    },
    {
      id: "2",
      title: "Building Responsive Designs with Tailwind CSS",
      excerpt:
        "Master the art of creating beautiful, responsive web designs using Tailwind CSS utility classes and best practices.",
      publishedAt: "2024-01-10",
      category: "Design",
      views: 890,
      likes: 28,
      comments: 8,
      isLiked: true,
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser(mockUser)
      setPosts(mockUserPosts)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    if (user) {
      setUser({
        ...user,
        followers: isFollowing ? user.followers - 1 : user.followers + 1,
      })
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="blog-container py-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="blog-card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="blog-container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
            <Button asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="blog-container py-8">
        {/* Profile Header */}
        <Card className="blog-card mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=128&width=128"} alt={user.name} />
                  <AvatarFallback className="text-3xl bg-blue-100 text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:mb-0">{user.name}</h1>
                  <Button
                    onClick={handleFollow}
                    className={isFollowing ? "bg-gray-500 hover:bg-gray-600" : "blog-button-primary"}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{user.bio}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">{user.followers.toLocaleString()}</span>
                    <span className="text-gray-600">Followers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">{user.following.toLocaleString()}</span>
                    <span className="text-gray-600">Following</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">{user.postsCount}</span>
                    <span className="text-gray-600">Posts</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="blog-card group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="blog-tag">
                          {post.category}
                        </Badge>
                      </div>

                      <Link href={`/post/${post.id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views}
                          </div>
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1 transition-colors ${
                              post.isLiked ? "text-red-500" : "hover:text-red-500"
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                            {post.likes}
                          </button>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="blog-card">
                <CardContent className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">{user.name} hasn't published any posts yet.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card className="blog-card">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                  </div>
                  {user.location && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-600">{user.location}</p>
                    </div>
                  )}
                  {user.website && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Member Since</h3>
                    <p className="text-gray-600">
                      {new Date(user.joinedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
