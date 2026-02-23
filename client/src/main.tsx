import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from 'react-router-dom'
import { Providers } from "./providers.tsx"
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPublishableKey || typeof clerkPublishableKey !== 'string') {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required');
}

createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <BrowserRouter>
      <Providers>
      <App />
      </Providers>
    </BrowserRouter>
  </ClerkProvider>,
)
