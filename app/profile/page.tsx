"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { Camera, X } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface UserPost {
  id: string
  title: string
  excerpt: string
  publishedAt: string
  category: string
  status: "published" | "draft"
  views: number
  likes: number
  comments: number
  tags: string[]
}

interface StatisticUser {
  id: string
  name: string
  avatar: string
  role: string
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatistic, setShowStatistic] = useState(false)
  const [statisticTab, setStatisticTab] = useState<"like" | "comment">("like")
  const [userPosts, setUserPosts] = useState<UserPost[]>([])
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Mock user posts
  const mockUserPosts: UserPost[] = [
    {
      id: "1",
      title: "5 Reasons to Learn Frontend Development in 2025",
      excerpt:
        "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, acces...",
      publishedAt: "2025-05-28T19:00:00Z",
      category: "Programming",
      status: "published",
      views: 1250,
      likes: 42,
      comments: 12,
      tags: ["Programming", "Frontend", "Coding"],
    },
    {
      id: "2",
      title: "5 Reasons to Learn Frontend Development in 2025",
      excerpt:
        "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, acces...",
      publishedAt: "2025-05-28T19:00:00Z",
      category: "Programming",
      status: "published",
      views: 890,
      likes: 28,
      comments: 8,
      tags: ["Programming", "Frontend", "Coding"],
    },
    {
      id: "3",
      title: "5 Reasons to Learn Frontend Development in 2025",
      excerpt:
        "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, acces...",
      publishedAt: "2025-05-28T19:00:00Z",
      category: "Programming",
      status: "published",
      views: 750,
      likes: 35,
      comments: 15,
      tags: ["Programming", "Frontend", "Coding"],
    },
    {
      id: "4",
      title: "5 Reasons to Learn Frontend Development in 2025",
      excerpt:
        "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, acces...",
      publishedAt: "2025-05-28T19:00:00Z",
      category: "Programming",
      status: "published",
      views: 920,
      likes: 41,
      comments: 9,
      tags: ["Programming", "Frontend", "Coding"],
    },
    {
      id: "5",
      title: "5 Reasons to Learn Frontend Development in 2025",
      excerpt:
        "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, acces...",
      publishedAt: "2025-05-28T19:00:00Z",
      category: "Programming",
      status: "published",
      views: 680,
      likes: 22,
      comments: 6,
      tags: ["Programming", "Frontend", "Coding"],
    },
  ]

  // Mock statistic users
  const mockLikeUsers: StatisticUser[] = [
    { id: "1", name: "Clarissa", avatar: "/images/avatars/clarissa.png", role: "Frontend Developer" },
    { id: "2", name: "Marco", avatar: "/images/avatars/marco.png", role: "Frontend Developer" },
    { id: "3", name: "Michael Sailor", avatar: "/images/avatars/michael.png", role: "Frontend Developer" },
    { id: "4", name: "Jessica Jane", avatar: "/images/avatars/jessica.png", role: "Frontend Developer" },
    { id: "5", name: "Alexandra", avatar: "/images/avatars/alexandra.png", role: "Frontend Developer" },
  ]

  const mockCommentUsers = [
    {
      id: "1",
      name: "Clarissa",
      avatar: "/images/avatars/clarissa.png",
      date: "27 Maret 2025",
      comment: "This is super insightful — thanks for sharing!",
    },
    {
      id: "2",
      name: "Marco",
      avatar: "/images/avatars/marco.png",
      date: "27 Maret 2025",
      comment: "Exactly what I needed to read today. Frontend is evolving so fast!",
    },
    {
      id: "3",
      name: "Michael Sailor",
      avatar: "/images/avatars/michael.png",
      date: "27 Maret 2025",
      comment: "Great breakdown! You made complex ideas sound simple.",
    },
    {
      id: "4",
      name: "Jessica Jane",
      avatar: "/images/avatars/jessica.png",
      date: "27 Maret 2025",
      comment: "As a beginner in frontend, this motivates me a lot. Appreciate it!",
    },
    {
      id: "5",
      name: "Alexandra",
      avatar: "/images/avatars/alexandra.png",
      date: "27 Maret 2025",
      comment: "Well-written and straight to the point. Keep posting content like this!",
    },
  ]

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        bio: user.bio || "Frontend Developer",
      })
    }
    setUserPosts(mockUserPosts)
  }, [user])

  const handleUpdateProfile = async () => {
    const success = await updateProfile(profileData)
    if (success) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setShowEditProfile(false)
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = () => {
    toast({
      title: "Password changed",
      description: "Your password has been updated successfully.",
    })
    setShowChangePassword(false)
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleDeletePost = (postId: string) => {
    setUserPosts(userPosts.filter((post) => post.id !== postId))
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully.",
    })
    setShowDeleteDialog(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
            <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg?height=64&width=64"} alt={user.name} />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{profileData.name}</h1>
                  <p className="text-gray-600">{profileData.bio}</p>
                </div>
              </div>
              <Button
                onClick={() => setShowEditProfile(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border border-gray-200 rounded-lg">
            <TabsTrigger value="posts" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Your Post
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Change Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{userPosts.length} Post</h2>
              <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                <Link href="/write" className="flex items-center space-x-2">
                  <img src="/images/icons/write-post.png" alt="Write Post" className="w-4 h-4" />
                  <span>Write Post</span>
                </Link>
              </Button>
            </div>

            {userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <Card key={post.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-48 h-32 flex-shrink-0">
                          <img
                            src="/images/laptop-workspace.png"
                            alt={post.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              <span>
                                Created{" "}
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                ,{" "}
                                {new Date(post.publishedAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="mx-2">•</span>
                              <span>
                                Last updated{" "}
                                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                ,{" "}
                                {new Date(post.publishedAt).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-4">
                            <button
                              onClick={() => {
                                setStatisticTab("like")
                                setShowStatistic(true)
                              }}
                              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                            >
                              Statistic
                            </button>
                            <Link
                              href={`/write?edit=${post.id}`}
                              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setShowDeleteDialog(true)}
                              className="text-red-500 hover:text-red-600 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6">
                      <img
                        src="/images/icons/empty-posts.png"
                        alt="No posts"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your writing journey starts here</h3>
                    <p className="text-gray-600 mb-6">
                      No posts yet, but every great writer starts with the first one.
                    </p>
                    <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                      <Link href="/write" className="flex items-center space-x-2">
                        <img src="/images/icons/write-post.png" alt="Write Post" className="w-4 h-4" />
                        <span>Write Post</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="password">
            <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="max-w-md mx-auto space-y-6">
                  <div>
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-900">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-900">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Enter confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full"
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Modal */}
        <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
          <DialogContent className="max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Edit Profile</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowEditProfile(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-blue-500 hover:bg-blue-600"
                  >
                    <Camera className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                  Name
                </Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-gray-900">
                  Profile Headline
                </Label>
                <Input
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full"
              >
                Update Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Delete</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="space-y-6">
              <p className="text-gray-600">Are you sure to delete?</p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button onClick={() => handleDeletePost("1")} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Statistic Modal */}
        <Dialog open={showStatistic} onOpenChange={setShowStatistic}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>Statistic</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowStatistic(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>

            <Tabs
              value={statisticTab}
              onValueChange={(value) => setStatisticTab(value as "like" | "comment")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="like" className="flex items-center space-x-2">
                  <span>👍</span>
                  <span>Like</span>
                </TabsTrigger>
                <TabsTrigger value="comment" className="flex items-center space-x-2">
                  <span>💬</span>
                  <span>Comment</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="like" className="mt-6">
                <h3 className="font-medium text-gray-900 mb-4">Like (20)</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {mockLikeUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comment" className="mt-6">
                <h3 className="font-medium text-gray-900 mb-4">Comment (20)</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {mockCommentUsers.map((user) => (
                    <div key={user.id} className="flex space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{user.name}</span>
                          <span className="text-sm text-gray-500">{user.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{user.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">© 2025 Web Programming Hack Blog All rights reserved.</p>
      </footer>
    </div>
  )
}
