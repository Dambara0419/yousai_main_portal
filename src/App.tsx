import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PortalPage } from '@/pages/PortalPage'
import { ImageGenPage } from '@/pages/ImageGenPage'

function AppLayout() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<PortalPage searchQuery={searchQuery} />} />
          <Route path="/image-gen" element={<ImageGenPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
