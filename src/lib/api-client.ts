/**
 * API Client for backend integration
 * Replaces mock API calls with real backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Auth token management
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token)
}

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token')
}

// Fetch wrapper with auth header
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Token ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

// Products API
export async function getProducts(params?: {
  q?: string
  category?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (params?.q) queryParams.append('search', params.q)
  if (params?.category) queryParams.append('category', params.category)
  if (params?.page) queryParams.append('page', params.page)
  if (params?.limit) queryParams.append('page_size', params.limit)

  return fetchAPI(`/products/?${queryParams.toString()}`)
}

export async function getProductById(id: string) {
  return fetchAPI(`/products/${id}/`)
}

export async function createProduct(data: any) {
  return fetchAPI('/products/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduct(id: string, data: any) {
  return fetchAPI(`/products/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: string) {
  return fetchAPI(`/products/${id}/`, {
    method: 'DELETE',
  })
}

export async function getCategories() {
  return fetchAPI('/categories/')
}

// Orders API
export async function getOrders() {
  return fetchAPI('/orders/')
}

export async function getOrderById(id: string) {
  return fetchAPI(`/orders/${id}/`)
}

export async function createOrder(data: {
  items: Array<{ product_id: string; quantity: number }>
  shipping_name: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
  shipping_country: string
}) {
  return fetchAPI('/orders/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateOrderStatus(id: string, status: string) {
  return fetchAPI(`/orders/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Auth API
export async function registerUser(email: string, password: string, name: string) {
  const data = await fetchAPI('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password, username: name }),
  })
  if (data.token) {
    setAuthToken(data.token)
  }
  return data
}

export async function loginUser(email: string, password: string) {
  const data = await fetchAPI('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
  })
  if (data.token) {
    setAuthToken(data.token)
  }
  return data
}

export async function logoutUser() {
  removeAuthToken()
}

export async function getCurrentUser() {
  return fetchAPI('/auth/user/')
}

// Addresses API
export async function getAddresses() {
  return fetchAPI('/addresses/')
}

export async function createAddress(data: any) {
  return fetchAPI('/addresses/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateAddress(id: string, data: any) {
  return fetchAPI(`/addresses/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteAddress(id: string) {
  return fetchAPI(`/addresses/${id}/`, {
    method: 'DELETE',
  })
}

// Payment Methods API
export async function getPaymentMethods() {
  return fetchAPI('/payment-methods/')
}

export async function createPaymentMethod(data: any) {
  return fetchAPI('/payment-methods/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deletePaymentMethod(id: string) {
  return fetchAPI(`/payment-methods/${id}/`, {
    method: 'DELETE',
  })
}

// Reviews API
export async function getProductReviews(productId: string) {
  return fetchAPI(`/products/${productId}/reviews/`)
}

export async function createReview(productId: string, data: any) {
  return fetchAPI(`/products/${productId}/reviews/`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
