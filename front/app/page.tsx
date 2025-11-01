'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function Home() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(res => res.json())
      .then(data => {
        setHealth(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('API not reachable:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>API Dashboard</h1>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>API Status</h2>
        {loading ? (
          <p>Checking API...</p>
        ) : health ? (
          <div>
            <p>✅ <strong>{health.message}</strong></p>
            <p>Status: {health.status}</p>
            <p>Timestamp: {new Date(health.timestamp).toLocaleString()}</p>
          </div>
        ) : (
          <p>❌ API not reachable at {API_URL}</p>
        )}
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Quick Links</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/signup" style={{ 
                color: '#0070f3', 
                textDecoration: 'none',
                fontSize: '18px'
              }}>
                📝 Sign Up
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/login" style={{ 
                color: '#0070f3', 
                textDecoration: 'none',
                fontSize: '18px'
              }}>
                🔐 Login
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link href="/todos" style={{ 
                color: '#0070f3', 
                textDecoration: 'none',
                fontSize: '18px'
              }}>
                📋 Todos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

