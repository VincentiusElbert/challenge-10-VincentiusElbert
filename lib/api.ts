const API_BASE_URL = "https://blogger-wph-api-production.up.railway.app/api"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: {
    id: string
    name: string
    avatar?: string
  }
  publishedAt: string
  updatedAt: string
  likes: number
  comments: number
  views: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  joinedAt: string
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "An error occurred",
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: "Network error occurred",
      }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  }

  async getProfile() {
    return this.request<User>("/auth/profile")
  }

  // Posts endpoints
  async getPosts(page = 1, limit = 10, category?: string, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(search && { search }),
    })

    return this.request<{ posts: Post[]; total: number; pages: number }>(`/posts?${params}`)
  }

  async getPost(id: string) {
    return this.request<Post>(`/posts/${id}`)
  }

  async createPost(postData: Partial<Post>) {
    return this.request<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    })
  }

  async updatePost(id: string, postData: Partial<Post>) {
    return this.request<Post>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    })
  }

  async deletePost(id: string) {
    return this.request<void>(`/posts/${id}`, {
      method: "DELETE",
    })
  }

  async likePost(id: string) {
    return this.request<{ likes: number }>(`/posts/${id}/like`, {
      method: "POST",
    })
  }

  async bookmarkPost(id: string) {
    return this.request<void>(`/posts/${id}/bookmark`, {
      method: "POST",
    })
  }

  // User endpoints
  async getUser(id: string) {
    return this.request<User>(`/users/${id}`)
  }

  async getUserPosts(id: string, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    return this.request<{ posts: Post[]; total: number; pages: number }>(`/users/${id}/posts?${params}`)
  }

  async followUser(id: string) {
    return this.request<void>(`/users/${id}/follow`, {
      method: "POST",
    })
  }

  async unfollowUser(id: string) {
    return this.request<void>(`/users/${id}/unfollow`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
