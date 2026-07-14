import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { DataProvider } from './context/DataContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <OrderProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #2A3A52',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
              },
            }}
          />
        </OrderProvider>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
)
