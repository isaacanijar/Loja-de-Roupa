import { Route, Routes } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { RouteVeil } from '@/components/layout/RouteVeil'
import { ScrollToTop } from '@/components/layout/Page'
import { CartProvider } from '@/context/CartContext'

import Home from '@/pages/Home'
import Collection from '@/pages/Collection'
import ProductPage from '@/pages/ProductPage'
import Lookbook from '@/pages/Lookbook'
import Atelier from '@/pages/Atelier'
import Booking from '@/pages/Booking'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <RouteVeil />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/colecao" element={<Collection />} />
        <Route path="/produto/:slug" element={<ProductPage />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/atelie" element={<Atelier />} />
        <Route path="/provador" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
