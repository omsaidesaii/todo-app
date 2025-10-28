import { useState, useEffect, useMemo } from 'react'
import { useAuth } from './context/AuthContext'
import { authFetch } from './services/api'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Select } from './components/ui/select'
import { Card, CardContent } from './components/ui/card'
import { Checkbox } from './components/ui/checkbox'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [inputDueDate, setInputDueDate] = useState('')
  const [inputCategory, setInputCategory] = useState('General')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showCompleted, setShowCompleted] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, isAuthenticated, logout } = useAuth()

  const API_URL = 'http://localhost:5000/api/todos'

  const categories = ['All', 'General', 'Work', 'Personal', 'Shopping', 'Health', 'Education']

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
        body: JSON.stringify({ 
          text: inputValue,
          dueDate: inputDueDate || null,
          category: inputCategory
        })
      })
      if (!response.ok) throw new Error('Failed to add todo')
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setInputValue('')
      setInputDueDate('')
      setInputCategory('General')
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

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Search filter
      if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (selectedCategory !== 'All' && todo.category !== selectedCategory) {
        return false
      }
      
      // Completed filter
      if (!showCompleted && todo.completed) {
        return false
      }
      
      return true
    })
  }, [todos, searchQuery, selectedCategory, showCompleted])

  // Get overdue status
  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && !isNaN(new Date(dueDate).getTime())
  }

  const formatDate = (date) => {
    if (!date) return null
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return null
    }
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
      <div className="max-w-4xl mx-auto">
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

        {/* Search and Filter Bar */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showCompleted ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? 'Hide Completed' : 'Show Completed'}
              </Button>
              <span className="text-sm text-gray-600 flex items-center">
                {filteredTodos.length} of {todos.length} todos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Add Todo Form */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a new todo..."
                className="mb-3"
                required
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={inputDueDate}
                  onChange={(e) => setInputDueDate(e.target.value)}
                  placeholder="Due date (optional)"
                  className="flex-1"
                />
                <Select
                  value={inputCategory}
                  onChange={(e) => setInputCategory(e.target.value)}
                  className="w-40"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
                <Button type="submit" disabled={loading}>
                  Add Todo
                </Button>
              </div>
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
        ) : filteredTodos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              {todos.length === 0 
                ? "No todos yet. Add one above!" 
                : "No todos match your filters."}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredTodos.map((todo) => {
              const dueDate = formatDate(todo.dueDate)
              const overdue = isOverdue(todo.dueDate)
              
              return (
                <Card key={todo._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
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
                      <div className="flex items-center gap-4 ml-7 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          todo.category === 'Work' ? 'bg-blue-100 text-blue-800' :
                          todo.category === 'Personal' ? 'bg-purple-100 text-purple-800' :
                          todo.category === 'Shopping' ? 'bg-green-100 text-green-800' :
                          todo.category === 'Health' ? 'bg-red-100 text-red-800' :
                          todo.category === 'Education' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {todo.category}
                        </span>
                        {dueDate && (
                          <span className={`text-xs ${
                            overdue ? 'text-red-600 font-semibold' : 'text-gray-600'
                          }`}>
                            📅 Due: {dueDate} {overdue && '(Overdue!)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
