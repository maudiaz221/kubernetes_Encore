'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  userId: number
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('userId')
    setUserId(id)
    
    if (id) {
      loadTodos(id)
    }
  }, [])

  const loadTodos = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/todos/user/${id}`)
      const data = await res.json()
      setTodos(data.todos || [])
    } catch (err) {
      console.error('Failed to load todos:', err)
    }
  }

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      setMessage('❌ Please login first')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(userId),
          title,
          description: description || undefined,
        }),
      })

      if (res.ok) {
        setMessage('✅ Todo created!')
        setTitle('')
        setDescription('')
        loadTodos(userId)
      } else {
        setMessage('❌ Failed to create todo')
      }
    } catch (err) {
      setMessage('❌ Failed to connect to API')
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: number) => {
    try {
      await fetch(`${API_URL}/todos/${id}/toggle`, {
        method: 'PATCH',
      })
      if (userId) loadTodos(userId)
    } catch (err) {
      console.error('Failed to toggle todo:', err)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      })
      if (userId) loadTodos(userId)
    } catch (err) {
      console.error('Failed to delete todo:', err)
    }
  }

  if (!userId) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
        <h1>Todos</h1>
        <p>Please <Link href="/login" style={{ color: '#0070f3' }}>login</Link> first</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
        ← Back to Home
      </Link>

      <h1>My Todos</h1>

      <form onSubmit={handleCreateTodo} style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Create New Todo</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Creating...' : 'Add Todo'}
        </button>

        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </form>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Todo List</h2>
        
        {todos.length === 0 ? (
          <p>No todos yet. Create one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map(todo => (
              <li
                key={todo.id}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{todo.title}</strong>
                  {todo.description && <p style={{ margin: '5px 0 0 0', color: '#666' }}>{todo.description}</p>}
                </div>
                
                <div>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    style={{
                      padding: '5px 10px',
                      marginRight: '10px',
                      background: todo.completed ? '#28a745' : '#ffc107',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {todo.completed ? '✓' : '○'}
                  </button>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '5px 10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

