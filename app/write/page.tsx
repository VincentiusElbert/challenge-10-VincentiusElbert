"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const categories = [
  "Technology",
  "Web Development",
  "Design",
  "Programming",
  "Tutorial",
  "Opinion",
  "News",
  "Review",
] as const

export default function WritePage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  const editId = searchParams.get("edit")
  const isEditing = Boolean(editId)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    excerpt: "",
    tags: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  /* --------------------------------------------------
   * Prefill data if editing (mock)
   * -------------------------------------------------- */
  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: "Getting Started with Next.js 14",
        content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements that make building React applications even more powerful and efficient. In this comprehensive guide, we'll explore the key features and learn how to get started.
`,
        category: "Technology",
        excerpt: "Learn how to build modern web applications with the latest features of Next.js 14.",
        tags: "nextjs, react, web development, tutorial",
      })
    }
  }, [isEditing])

  /* --------------------------------------------------
   * Helpers
   * -------------------------------------------------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.content.trim()) newErrors.content = "Content is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCategoryChange = (value: string) => setFormData((prev) => ({ ...prev, category: value }))

  /* --------------------------------------------------
   * API mocks
   * -------------------------------------------------- */
  const fakeRequest = <T,>(data: T, ms = 900) => new Promise<T>((resolve) => setTimeout(() => resolve(data), ms))

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      await fakeRequest(true)
      toast({
        title: "Draft saved",
        description: "Your post has been saved as a draft.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to save draft.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!validateForm()) {
      toast({
        title: "Missing required fields",
        description: "Please complete all required fields before publishing.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await fakeRequest(true)
      toast({
        title: isEditing ? "Post updated!" : "Post published!",
        description: "Your post has been successfully saved.",
      })
      router.push("/profile")
    } catch {
      toast({
        title: "Error",
        description: "Failed to publish post.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /* --------------------------------------------------
   * UI
   * -------------------------------------------------- */
  return (
    <main className="container max-w-3xl py-10">
      <h1 className="mb-6 text-3xl font-bold">{isEditing ? "Edit Post" : "Write a New Post"}</h1>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Title */}
          <div>
            <Input placeholder="Post title" value={formData.title} onChange={handleChange("title")} />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <Textarea
              placeholder="Short excerpt (max 200 chars)"
              value={formData.excerpt}
              onChange={handleChange("excerpt")}
              rows={3}
            />
            {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
          </div>

          {/* Category & Tags */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
            <Input placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange("tags")} />
          </div>

          <Separator />

          {/* Markdown Content */}
          <div>
            <Textarea
              placeholder="Write your post in Markdown…"
              value={formData.content}
              onChange={handleChange("content")}
              rows={18}
              className="font-mono"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="space-x-3">
              <Button variant="outline" disabled={isLoading} onClick={handleSaveDraft}>
                Save draft
              </Button>
              <Button onClick={handlePublish} disabled={isLoading}>
                {isEditing ? "Update & Publish" : "Publish"}
              </Button>
            </div>
            {isLoading && <span className="text-sm text-muted-foreground">Processing…</span>}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
