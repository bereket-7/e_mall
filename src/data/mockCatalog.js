export const MOCK_CATEGORIES = [
  { id: 'electronics', name: 'Electronics', count: 4 },
  { id: 'fashion', name: 'Fashion', count: 2 },
  { id: 'home', name: 'Home & Garden', count: 2 },
  { id: 'books', name: 'Books', count: 2 },
  { id: 'sports', name: 'Sports & Outdoors', count: 2 }
]

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    price: 999,
    originalPrice: 1099,
    discount: 9,
    brand: 'Apple',
    category: 'electronics',
    rating: 4.8,
    reviewCount: 245,
    description: 'The most advanced iPhone yet with titanium design and A17 Pro chip.',
    images: [
      'https://images.unsplash.com/photo-1592286499084-3aa2d65e6e50?w=500',
      'https://images.unsplash.com/photo-1605464315542-6e5c11d7eb1e?w=500'
    ],
    variants: [
      {
        name: 'Color',
        options: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium']
      },
      { name: 'Storage', options: ['128GB', '256GB', '512GB', '1TB'] }
    ],
    features: ['A17 Pro chip', 'Pro camera system', 'Titanium design', 'Action Button'],
    inStock: true,
    stockCount: 50,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 899,
    originalPrice: 999,
    discount: 10,
    brand: 'Samsung',
    category: 'electronics',
    rating: 4.7,
    reviewCount: 189,
    description: 'Ultimate productivity with S Pen and AI-powered features.',
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500'
    ],
    variants: [
      {
        name: 'Color',
        options: ['Titanium Gray', 'Titanium Black', 'Titanium Violet', 'Titanium Yellow']
      },
      { name: 'Storage', options: ['256GB', '512GB', '1TB'] }
    ],
    features: ['S Pen included', '200MP camera', 'AI features', '5000mAh battery'],
    inStock: true,
    stockCount: 30,
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    name: 'Nike Air Force 1',
    slug: 'nike-air-force-1',
    price: 90,
    originalPrice: 110,
    discount: 18,
    brand: 'Nike',
    category: 'fashion',
    rating: 4.6,
    reviewCount: 523,
    description: 'Classic basketball shoe with timeless style and comfort.',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500'
    ],
    variants: [
      { name: 'Size', options: ['7', '8', '9', '10', '11', '12'] },
      { name: 'Color', options: ['White', 'Black', 'Red', 'Blue'] }
    ],
    features: ['Leather upper', 'Air-Sole unit', 'Rubber outsole', 'Classic design'],
    inStock: true,
    stockCount: 100,
    createdAt: '2024-01-10'
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    price: 349,
    originalPrice: 399,
    discount: 13,
    brand: 'Sony',
    category: 'electronics',
    rating: 4.9,
    reviewCount: 342,
    description: 'Industry-leading noise canceling headphones with exceptional sound quality.',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    variants: [{ name: 'Color', options: ['Black', 'Silver'] }],
    features: ['30-hour battery', 'Quick charge', 'Multipoint connection', 'Touch controls'],
    inStock: true,
    stockCount: 25,
    createdAt: '2024-01-05'
  },
  {
    id: 5,
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    price: 180,
    originalPrice: 200,
    discount: 10,
    brand: 'Adidas',
    category: 'fashion',
    rating: 4.5,
    reviewCount: 298,
    description: 'Running shoes with responsive cushioning and energy return.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'
    ],
    variants: [
      { name: 'Size', options: ['7', '8', '9', '10', '11', '12'] },
      { name: 'Color', options: ['White', 'Black', 'Blue', 'Gray'] }
    ],
    features: ['Boost midsole', 'Primeknit upper', 'Continental rubber', 'Energy return'],
    inStock: true,
    stockCount: 75,
    createdAt: '2024-01-12'
  },
  {
    id: 6,
    name: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    price: 2499,
    originalPrice: 2699,
    discount: 7,
    brand: 'Apple',
    category: 'electronics',
    rating: 4.8,
    reviewCount: 156,
    description: 'Powerful laptop for professionals with M3 Pro chip and stunning display.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'
    ],
    variants: [
      { name: 'Color', options: ['Space Gray', 'Silver'] },
      { name: 'Memory', options: ['18GB', '36GB'] },
      { name: 'Storage', options: ['512GB', '1TB', '2TB'] }
    ],
    features: ['M3 Pro chip', 'Liquid Retina XDR display', '22-hour battery', 'Studio-quality mics'],
    inStock: true,
    stockCount: 15,
    createdAt: '2024-01-08'
  },
  {
    id: 7,
    name: 'Ceramic Plant Pot Set',
    slug: 'ceramic-plant-pot-set',
    price: 45,
    originalPrice: 55,
    discount: 18,
    brand: 'HomeNest',
    category: 'home',
    rating: 4.4,
    reviewCount: 88,
    description: 'Set of 3 modern ceramic pots perfect for indoor plants.',
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'],
    variants: [{ name: 'Color', options: ['White', 'Terracotta', 'Sage'] }],
    features: ['Drainage holes', 'Set of 3', 'Matte finish'],
    inStock: true,
    stockCount: 60,
    createdAt: '2024-02-01'
  },
  {
    id: 8,
    name: 'LED Desk Lamp',
    slug: 'led-desk-lamp',
    price: 39,
    originalPrice: 49,
    discount: 20,
    brand: 'Luma',
    category: 'home',
    rating: 4.3,
    reviewCount: 112,
    description: 'Adjustable LED desk lamp with touch controls and USB charging.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'],
    variants: [{ name: 'Color', options: ['Black', 'White'] }],
    features: ['3 brightness levels', 'USB port', 'Eye-care mode'],
    inStock: true,
    stockCount: 40,
    createdAt: '2024-02-05'
  },
  {
    id: 9,
    name: 'The Design of Everyday Things',
    slug: 'design-of-everyday-things',
    price: 18,
    originalPrice: 22,
    discount: 18,
    brand: 'Basic Books',
    category: 'books',
    rating: 4.7,
    reviewCount: 1204,
    description: 'Classic book on human-centered design by Don Norman.',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
    variants: [{ name: 'Format', options: ['Paperback', 'Hardcover'] }],
    features: ['Revised edition', '368 pages'],
    inStock: true,
    stockCount: 200,
    createdAt: '2024-01-25'
  },
  {
    id: 10,
    name: 'Atomic Habits',
    slug: 'atomic-habits',
    price: 16,
    originalPrice: 20,
    discount: 20,
    brand: 'Avery',
    category: 'books',
    rating: 4.8,
    reviewCount: 5400,
    description: 'Tiny changes, remarkable results — a practical guide to building habits.',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
    variants: [{ name: 'Format', options: ['Paperback', 'Hardcover', 'Audiobook'] }],
    features: ['Bestseller', '320 pages'],
    inStock: true,
    stockCount: 150,
    createdAt: '2024-01-28'
  },
  {
    id: 11,
    name: 'Yoga Mat Pro',
    slug: 'yoga-mat-pro',
    price: 42,
    originalPrice: 55,
    discount: 24,
    brand: 'FlexFit',
    category: 'sports',
    rating: 4.5,
    reviewCount: 320,
    description: 'Non-slip yoga mat with extra cushioning for joint support.',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    variants: [
      { name: 'Thickness', options: ['4mm', '6mm', '8mm'] },
      { name: 'Color', options: ['Purple', 'Blue', 'Black'] }
    ],
    features: ['Non-slip', 'Eco-friendly', 'Carry strap'],
    inStock: true,
    stockCount: 80,
    createdAt: '2024-02-10'
  },
  {
    id: 12,
    name: 'Adjustable Dumbbells 50lb',
    slug: 'adjustable-dumbbells-50lb',
    price: 129,
    originalPrice: 159,
    discount: 19,
    brand: 'IronPeak',
    category: 'sports',
    rating: 4.6,
    reviewCount: 210,
    description: 'Space-saving adjustable dumbbells replacing a full weight set.',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'],
    variants: [{ name: 'Weight', options: ['25lb pair', '50lb pair'] }],
    features: ['Quick adjust', 'Durable steel', 'Compact'],
    inStock: false,
    stockCount: 0,
    createdAt: '2024-02-12'
  }
]

export const MOCK_COUPONS = {
  SAVE10: { code: 'SAVE10', type: 'percentage', discount: 0.1, value: 0.1 },
  SAVE20: { code: 'SAVE20', type: 'percentage', discount: 0.2, value: 0.2 },
  FREESHIP: { code: 'FREESHIP', type: 'free_shipping', discount: 0, value: 0 }
}

export const MOCK_REVIEWS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 weeks ago',
    avatar: 'https://via.placeholder.com/40',
    comment: 'Excellent product! Exactly as described and arrived quickly. Highly recommend!',
    moderated: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    rating: 4,
    date: '1 month ago',
    avatar: 'https://via.placeholder.com/40',
    comment: 'Great quality and good value for money. Will definitely buy again.',
    moderated: true
  },
  {
    id: 3,
    name: 'Emily Davis',
    rating: 5,
    date: '1 month ago',
    avatar: 'https://via.placeholder.com/40',
    comment: 'Love this product! Perfect for my needs and the customer service was excellent.',
    moderated: true
  }
]
