const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  async register(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    return response.json()
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  },

  getToken() {
    return localStorage.getItem('token')
  },

  setToken(token) {
    localStorage.setItem('token', token)
  },

  removeToken() {
    localStorage.removeItem('token')
  },

  async getJournalEntries({ search, mood } = {}) {
    const token = localStorage.getItem('token')

    const params = new URLSearchParams()
    if (search && typeof search === 'string' && search.trim()) params.set('search', search.trim())
    if (mood && typeof mood === 'string' && mood.trim() && mood !== 'All Moods') {
      params.set('mood', mood.trim())
    }

    const qs = params.toString()
    const url = `${API_BASE_URL}/journal${qs ? `?${qs}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch journal entries')
    }

    const data = await response.json()
    return data.entries || []
  },

  async createJournalEntry({ title, mood, content }) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, mood, content }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to create journal entry')
    }

    const data = await response.json()
    return data.entry
  },

  async updateJournalEntry(id, { title, mood, content }) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, mood, content }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to update journal entry')
    }

    const data = await response.json()
    return data.entry
  },

  async deleteJournalEntry(id) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/journal/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to delete journal entry')
    }

    const data = await response.json()
    return data.id
  },

  async getMoodHistory() {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/mood`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch mood history')
    }

    const data = await response.json()
    return data.logs || []
  },

  async saveMood(mood, note) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/mood`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mood, note }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to save mood')
    }

    const data = await response.json()
    return data.log
  },

  async createFocusSession(mode, durationMinutes, completed) {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/focus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode, durationMinutes, completed }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to create focus session')
    }

    const data = await response.json()
    return data.session
  },

  async getFocusStats() {
    const token = localStorage.getItem('token')

    const response = await fetch(`${API_BASE_URL}/focus/total`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch focus stats')
    }

    const data = await response.json()
    return data.stats
  },
}

