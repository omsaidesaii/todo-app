// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Make authenticated API request
export const authFetch = async (url, options = {}) => {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch(url, {
    ...options,
    headers
  })
}

