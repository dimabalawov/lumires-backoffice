/**
 * Lumières Backoffice — API Service Layer
 * 
 * Central configuration for all API calls to the C# backend.
 * Replace BASE_URL with your actual backend URL when ready.
 * All endpoints are typed and ready to plug in.
 */

// ============================================================
//  CONFIG — Change these when your C# backend is ready
// ============================================================
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ============================================================
//  Types
// ============================================================
export interface Film {
  id: string;
  title: string;
  year: number;
  director: string;
  genre: string;
  posterUrl: string;
  backdropUrl?: string;
  synopsis: string;
  runtime: number; // minutes
  rating: number; // average, 0-5
  reviewCount: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'banned';
  filmCount: number;
  reviewCount: number;
  listCount: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface Review {
  id: string;
  filmId: string;
  filmTitle: string;
  filmPosterUrl?: string;
  userId: string;
  username: string;
  userAvatarUrl?: string;
  rating: number; // 0-5, half-star increments
  content: string;
  likesCount: number;
  commentsCount: number;
  status: 'published' | 'flagged' | 'removed';
  createdAt: string;
}

export interface FilmList {
  id: string;
  title: string;
  description: string;
  userId: string;
  username: string;
  filmCount: number;
  likesCount: number;
  visibility: 'public' | 'private';
  coverUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Thread {
  id: string;
  title: string;
  userId: string;
  username: string;
  category: string;
  replyCount: number;
  viewCount: number;
  status: 'open' | 'closed' | 'pinned';
  createdAt: string;
  lastReplyAt: string;
}

export interface DashboardStats {
  totalFilms: number;
  totalUsers: number;
  totalReviews: number;
  totalLists: number;
  filmsTrend: number;     // % change
  usersTrend: number;
  reviewsTrend: number;
  listsTrend: number;
  recentActivity: ActivityItem[];
  chartData: ChartDataPoint[];
}

export interface ActivityItem {
  id: string;
  type: 'review' | 'user_joined' | 'film_added' | 'list_created' | 'report';
  description: string;
  user: string;
  timestamp: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

// ============================================================
//  Real Backend Types (matched to ASP.NET response shapes)
// ============================================================

export interface MovieListItem {
  id: string;
  externalId: number;
  title: string;
  voteCount: number;
  backdropPath: string | null;
}

export interface MovieListResponse {
  items: MovieListItem[];
}

export interface MovieLocalization {
  languageCode: string;
  title: string;
  overview: string | null;
}

export interface MovieDetail {
  id: string;
  releaseDate: string;
  trailerUrl: string | null;
  posterPath: string;
  backdropPath: string | null;
  localization: MovieLocalization | null;
}

export interface MovieSource {
  externalId: number;
  providerName: string;
  type: string;
  url: string;
  quality: string;
  price: number | null;
}

export interface MovieSourcesResponse {
  sources: MovieSource[];
}

export const tmdbImage = (path: string | null | undefined, size = 'w500'): string | null =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// ============================================================
//  HTTP Client
// ============================================================
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: response.statusText,
        status: response.status,
      }));
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // ---- Films ----
  async getFilms(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    genre?: string;
    status?: string;
    sortBy?: string;
  }): Promise<PaginatedResponse<Film>> {
    return this.request('GET', '/films', undefined, params as Record<string, string | number | undefined>);
  }

  async getFilm(id: string): Promise<Film> {
    return this.request('GET', `/films/${id}`);
  }

  async createFilm(data: Partial<Film>): Promise<Film> {
    return this.request('POST', '/films', data);
  }

  async updateFilm(id: string, data: Partial<Film>): Promise<Film> {
    return this.request('PUT', `/films/${id}`, data);
  }

  async deleteFilm(id: string): Promise<void> {
    return this.request('DELETE', `/films/${id}`);
  }

  // ---- Users ----
  async getUsers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<PaginatedResponse<User>> {
    return this.request('GET', '/users', undefined, params as Record<string, string | number | undefined>);
  }

  async getUser(id: string): Promise<User> {
    return this.request('GET', `/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request('PUT', `/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.request('DELETE', `/users/${id}`);
  }

  // ---- Reviews ----
  async getReviews(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    filmId?: string;
    userId?: string;
  }): Promise<PaginatedResponse<Review>> {
    return this.request('GET', '/reviews', undefined, params as Record<string, string | number | undefined>);
  }

  async getReview(id: string): Promise<Review> {
    return this.request('GET', `/reviews/${id}`);
  }

  async updateReviewStatus(id: string, status: Review['status']): Promise<Review> {
    return this.request('PATCH', `/reviews/${id}/status`, { status });
  }

  async deleteReview(id: string): Promise<void> {
    return this.request('DELETE', `/reviews/${id}`);
  }

  // ---- Lists ----
  async getLists(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    visibility?: string;
  }): Promise<PaginatedResponse<FilmList>> {
    return this.request('GET', '/lists', undefined, params as Record<string, string | number | undefined>);
  }

  async getList(id: string): Promise<FilmList> {
    return this.request('GET', `/lists/${id}`);
  }

  async deleteList(id: string): Promise<void> {
    return this.request('DELETE', `/lists/${id}`);
  }

  // ---- Threads ----
  async getThreads(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<PaginatedResponse<Thread>> {
    return this.request('GET', '/threads', undefined, params as Record<string, string | number | undefined>);
  }

  async getThread(id: string): Promise<Thread> {
    return this.request('GET', `/threads/${id}`);
  }

  async updateThreadStatus(id: string, status: Thread['status']): Promise<Thread> {
    return this.request('PATCH', `/threads/${id}/status`, { status });
  }

  async deleteThread(id: string): Promise<void> {
    return this.request('DELETE', `/threads/${id}`);
  }

  // ---- Movies (real backend) ----
  async getPopularThisWeek(): Promise<MovieListResponse> {
    return this.request('GET', '/movies/popular-this-week');
  }

  async getRecentThisWeek(): Promise<MovieListResponse> {
    return this.request('GET', '/movies/recent-this-week');
  }

  async getMovieDetail(tmdbId: number): Promise<MovieDetail> {
    return this.request('GET', `/movies/${tmdbId}`);
  }

  async getMovieSources(tmdbId: number): Promise<MovieSourcesResponse> {
    return this.request('GET', `/movies/${tmdbId}/sources`);
  }

  // ---- Dashboard ----
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('GET', '/dashboard/stats');
  }

  // ---- Auth ----
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const result = await this.request<{ token: string; user: User }>('POST', '/auth/login', { email, password });
    this.setToken(result.token);
    return result;
  }

  async logout(): Promise<void> {
    await this.request('POST', '/auth/logout');
    this.clearToken();
  }
}

// ============================================================
//  Singleton Export
// ============================================================
export const api = new ApiClient(BASE_URL);
export default api;
