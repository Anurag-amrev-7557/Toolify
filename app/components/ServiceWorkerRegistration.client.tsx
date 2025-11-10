"use client"

import { useEffect, useState } from 'react'

export default function ServiceWorkerRegistration() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let refreshing = false

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      // When the new SW takes control, reload so new content is shown
      window.location.reload()
    })

    // Try to get the active registration and listen for updates
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) return

      // If there's an installing worker, track it
      const trackInstalling = (worker: ServiceWorker | null) => {
        if (!worker) return
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New update available
              setWaitingWorker(worker)
              setShowUpdate(true)
            }
          }
        })
      }

      if (registration.waiting) {
        setWaitingWorker(registration.waiting)
        setShowUpdate(true)
      }

      if (registration.installing) {
        trackInstalling(registration.installing)
      }

      registration.addEventListener('updatefound', () => {
        trackInstalling(registration.installing)
      })
    })
  }, [])

  const onRefresh = () => {
    if (!waitingWorker) return
    // Send skipWaiting message to the waiting worker
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  }

  if (!showUpdate) return null

  return (
    <div style={{
      position: 'fixed',
      right: 16,
      bottom: 16,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.95)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: 12,
      boxShadow: '0 6px 18px rgba(2,6,23,0.4)'
    }}>
      <div style={{ marginBottom: 8 }}>A new version is available.</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onRefresh} style={{
          background: '#06b6d4',
          color: '#042b2d',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 600
        }}>Refresh</button>
        <button onClick={() => setShowUpdate(false)} style={{
          background: 'transparent',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '8px 12px',
          borderRadius: 8,
          cursor: 'pointer'
        }}>Dismiss</button>
      </div>
    </div>
  )
}
