import Layout from './components/layout/Layout'
import type { Category } from './types/product'

function App() {
  // Mock state for header
  const cartCount = 3
  const wishlistCount = 5
  const isUserLoggedIn = false

  // Mock categories for the header
  const mockCategories: Category[] = [
    {
      id: 'fashion',
      name: 'Thời trang',
      description: 'Quần áo, giày dép và phụ kiện thời trang',
      
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'electronics',
      name: 'Điện tử',
      description: 'Điện thoại, máy tính, phụ kiện công nghệ',
      
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'home',
      name: 'Nhà cửa',
      description: 'Nội thất, trang trí, dụng cụ gia dụng',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'appliances',
      name: 'Điện gia dụng',
      description: 'Thiết bị bếp, giặt, lạnh và làm lạnh',
      
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'sports',
      name: 'Thể thao',
      description: 'Quần áo thể thao, thiết bị tập luyện',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'books',
      name: 'Sách & Mã',
      description: 'Sách, truyện, tài liệu tham khảo',
      
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'gaming',
      name: 'Gaming',
      description: 'Bộ điều khiển, headset, bàn phím chuyên gaming',
      
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'audio',
      name: 'Âm thanh',
      description: 'Tai nghe, loa, micro và thiết bị âm thanh',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  const handleSearch = (query: string) => {
    console.log('Search query:', query)
  }

  const handleCartClick = () => {
    console.log('Cart clicked')
  }

  const handleWishlistClick = () => {
    console.log('Wishlist clicked')
  }

  return (
    <Layout
      categories={mockCategories}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
      isUserLoggedIn={isUserLoggedIn}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
    >
      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-black mb-4">Welcome to Fitness Mart</h1>
        <p className="text-gray-600 text-lg">No pain no gain.</p>
      </div>
    </Layout>
  )
}

export default App
