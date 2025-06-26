"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, MessageCircle, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  likes: number
  isLiked: boolean
}

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
    bio?: string
  }
  publishedAt: string
  updatedAt: string
  category: string
  readTime: string
  likes: number
  comments: number
  isLiked: boolean
  isBookmarked: boolean
  image: string
}

export default function PostDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  const mockPost: Post = {
    id: "1",
    title: "5 Reasons to Learn Frontend Development in 2025",
    content: `Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and intuitive. As we move into 2025, the demand for skilled frontend developers continues to rise.

Here are 5 reasons why you should start learning frontend development today:

**1. High Industry Demand**

Tech companies, startups, and even traditional businesses are constantly looking for frontend developers to help them deliver high-quality digital experiences.

**2. Powerful and Beginner-Friendly Tools**

Modern frameworks like React, Vue, and Svelte make it easier than ever to build interactive UIs. Their growing ecosystems and active communities mean you'll find support at every step.

**3. Creative Freedom**

Frontend development allows you to bring your design ideas to life. From animations to responsive layouts, your creativity directly impacts how users engage with a product.

**4. Rapid Career Growth**

With roles like UI Developer, React Developer, and Frontend Engineer, you'll find plenty of opportunities with competitive salaries and growth potential.

**5. Essential for Fullstack Development**

Understanding frontend is crucial if you want to become a fullstack developer. It complements your backend knowledge and enables you to build complete applications.

**Conclusion:**

If you're interested in building things that users interact with daily, frontend development is the path to take. Whether you're a designer learning to code or a backend developer exploring the frontend, 2025 is the perfect year to start.`,
    author: {
      id: "1",
      name: "John Doe",
      avatar: "/images/profile-avatar.png",
      bio: "Full-stack developer and technical writer with 5+ years of experience in React and Next.js. Passionate about sharing knowledge and helping others learn modern web development.",
    },
    publishedAt: "2025-05-27T10:00:00Z",
    updatedAt: "2025-05-27T10:00:00Z",
    category: "Programming",
    readTime: "8 min read",
    likes: 20,
    comments: 5,
    isLiked: false,
    isBookmarked: false,
    image: "/images/laptop-workspace.png",
  }

  const mockComments: Comment[] = [
    {
      id: "1",
      content: "This is super insightful — thanks for sharing!",
      author: {
        id: "2",
        name: "Clarissa",
        avatar: "/images/avatars/clarissa.png",
      },
      createdAt: "2025-03-27T12:00:00Z",
      likes: 5,
      isLiked: false,
    },
    {
      id: "2",
      content: "Exactly what I needed to read today. Frontend is evolving so fast!",
      author: {
        id: "3",
        name: "Marco",
        avatar: "/images/avatars/marco.png",
      },
      createdAt: "2025-03-27T14:30:00Z",
      likes: 3,
      isLiked: true,
    },
    {
      id: "3",
      content: "Great breakdown! You made complex ideas sound simple.",
      author: {
        id: "4",
        name: "Michael Sailor",
        avatar: "/images/avatars/michael.png",
      },
      createdAt: "2025-03-27T16:45:00Z",
      likes: 2,
      isLiked: false,
    },
    {
      id: "4",
      content: "As a beginner in frontend, this motivates me a lot. Appreciate it!",
      author: {
        id: "5",
        name: "Jessica Jane",
        avatar: "/images/avatars/jessica.png",
      },
      createdAt: "2025-03-27T18:20:00Z",
      likes: 4,
      isLiked: false,
    },
    {
      id: "5",
      content: "Well-written and straight to the point. Keep posting content like this!",
      author: {
        id: "6",
        name: "Alexandra",
        avatar: "/images/avatars/alexandra.png",
      },
      createdAt: "2025-03-27T20:15:00Z",
      likes: 6,
      isLiked: false,
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(mockPost)
      setComments(mockComments)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleLike = () => {
    if (!post) return
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
    })
  }

  const handleBookmark = () => {
    if (!post) return
    setPost({
      ...post,
      isBookmarked: !post.isBookmarked,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
          : comment,
      ),
    )
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
    if (post) {
      setPost({ ...post, comments: post.comments + 1 })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
            <Button asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {post.category}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Frontend
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Coding
            </Badge>
          </div>

          {/* Author Info & Engagement */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href={`/profile/${post.author.id}`}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar || "/placeholder.svg?height=40&width=40"} alt={post.author.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600">{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-sm ${
                  post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                } transition-colors`}
              >
                <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={() => setShowCommentsModal(true)}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-8">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "") return null

            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <h3 key={index} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                  {paragraph.replace(/\*\*/g, "")}
                </h3>
              )
            }

            return (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Comments({post.comments})</h3>
          </div>

          {/* Comment Form */}
          {user && (
            <div className="mb-8">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-2">Give your Comments</p>
                  <Textarea
                    placeholder="Enter your comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {comments.length > 3 && (
            <button
              onClick={() => setShowCommentsModal(true)}
              className="mt-6 text-blue-500 hover:text-blue-600 font-medium"
            >
              See All Comments
            </button>
          )}
        </div>

        {/* Comments Modal */}
        <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden p-0">
            <DialogHeader className="p-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">Comments({post.comments})</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCommentsModal(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Add Comment in Modal */}
              {user && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Give your Comments</h3>
                  <Textarea
                    placeholder="Enter your comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 mb-3"
                    rows={4}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                  >
                    Send
                  </Button>
                </div>
              )}

              {/* All Comments */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {comment.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Another Post Section */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold mb-6">Another Post</h3>
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="w-48 h-32 flex-shrink-0">
                  <img
                    src="/images/laptop-workspace.png"
                    alt="Another post"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <Link href="/post/2">
                    <h4 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                      5 Reasons to Learn Frontend Development in 2025
                    </h4>
                  </Link>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      Programming
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      Frontend
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      Coding
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Frontend development is more than just building beautiful user interfaces — it's about crafting user
                    experiences that are fast, access...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/images/profile-avatar.png" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">John Doe</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">27 May 2025</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Heart className="h-4 w-4" />
                        <span>20</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <MessageCircle className="h-4 w-4" />
                        <span>20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">© 2025 Web Programming Hack Blog All rights reserved.</p>
      </footer>
    </div>
  )
}
