import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  // Di file utama aplikasi React, misalnya index.js atau App.js

  // Pendaftaran service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered with scope:', registration.scope);
        await askNotificationPermission(); // Meminta izin notifikasi
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }

  // Permintaan izin notifikasi
  async function askNotificationPermission() {
    if (Notification.permission !== 'granted') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await subscribePush(); // Jika izin diberikan, mendaftarkan push
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    } else {
      await subscribePush();
    }
  }

  // Mendaftarkan push subscription ke server
  async function subscribePush() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BDxMT_RQQpFZ3HG4mseikGbzjnerMUV1ePxGVq6cdZXsM5u1qHCmJK0_fnHYCL9nixVhHhJU5Q1sSm8JINBr0S8', // Gunakan VAPID public key
        });

        // Kirim subscription ke server
        await sendSubscriptionToServer(subscription);
      } catch (error) {
        console.error('Error subscribing to push:', error);
      }
    } else {
      console.error('Service workers are not supported.');
    }
  }

  // Kirim subscription ke server Anda
  async function sendSubscriptionToServer(subscription) {
    const userId = prompt('Masukkan ID pengguna:');
    try {
      const response = await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, subscription }),
      });
      if (response.ok) {
        console.log('Subscription sent to server.');
      } else {
        console.error('Failed to send subscription to server.');
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  // Ganti dengan ID pengguna yang ingin Anda kirim notifikasi

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
