import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { authFetch } from './services/api'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent } from './components/ui/card'
import { Checkbox } from './components/ui/checkbox'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, isAuthenticated, logout } = useAuth()

  const API_URL = 'http://localhost:5000/api/todos'

  // Fetch todos on mount and when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos()
    }
  }, [isAuthenticated])

  const fetchTodos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await authFetch(API_URL)
      if (!response.ok) {
        if (response.status === 401) {
          logout()
          throw new Error('Unauthorized. Please login again.')
        }
        throw new Error('Failed to fetch todos')
      }
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!inputValue.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await authFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ text: inputValue })
      })
      if (!response.ok) throw new Error('Failed to add todo')
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setInputValue('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id, completed) => {
    setError(null)
    try {
      const response = await authFetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !completed })
      })
      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t._id === id ? updatedTodo : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTodo = async (id) => {
    setError(null)
    try {
      const response = await authFetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos(todos.filter(t => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addTodo()
  }

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        {isLogin ? (
          <Login onSwitch={() => setIsLogin(false)} />
        ) : (
          <Signup onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    )
  }

  // Show todo list if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            My Todo List
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                Add Todo
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {loading && todos.length === 0 ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : todos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No todos yet. Add one above!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <Card key={todo._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo._id, todo.completed)}
                    />
                    <span
                      className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTodo(todo._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
