import React, { Component } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import App from './App.jsx'

class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <main style={{ minHeight: '100vh', padding: '120px 8vw', background: '#1a1a18', color: '#f3eee4', fontFamily: 'Arial, sans-serif' }}>
        <p style={{ color: '#c9bca8', fontSize: 12, letterSpacing: '0.15em' }}>ESPÍRITU + VERDAD</p>
        <h1 style={{ fontSize: 'clamp(48px, 9vw, 120px)', margin: '20px 0' }}>Estamos ajustando esta pantalla.</h1>
        <a href="#oikos" onClick={() => this.setState({ error: null })} style={{ color: '#f3eee4' }}>VOLVER A INICIO →</a>
      </main>
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(<AppErrorBoundary><App /></AppErrorBoundary>)
