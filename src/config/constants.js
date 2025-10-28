// Celo Network Configuration
export const CELO_NETWORKS = {
  alfajores: {
    name: 'Celo Alfajores',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    chainId: 44787,
    currency: 'CELO',
    explorer: 'https://alfajores.celoscan.io'
  },
  mainnet: {
    name: 'Celo Mainnet',
    rpcUrl: 'https://forno.celo.org',
    chainId: 42220,
    currency: 'CELO',
    explorer: 'https://celoscan.io'
  }
};

// Current network (Alfajores for testing)
export const CURRENT_NETWORK = CELO_NETWORKS.alfajores;

// Sample accommodations data (Uganda)
export const SAMPLE_ACCOMMODATIONS = [
  {
    id: 1,
    name: 'Kampala Paradise Hotel',
    type: 'hotel',
    location: 'Kampala, Central Region',
    rating: 4.5,
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    pricePerNight: 5, // in CELO
    currency: 'CELO',
    description: 'A beautiful hotel in the heart of Kampala with modern amenities and excellent service.',
    amenities: ['WiFi', 'Parking', 'Restaurant', 'Pool', 'Spa'],
    available: true
  },
  {
    id: 2,
    name: 'Bwindi Mountain Lodge',
    type: 'homestay',
    location: 'Bwindi Impenetrable Forest',
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
    pricePerNight: 8,
    currency: 'CELO',
    description: 'Experience authentic rural life near the gorilla trekking site. Traditional meals and cultural immersion.',
    amenities: ['Traditional Meals', 'Cultural Tours', 'Mountain Views', 'Guided Hikes'],
    available: true
  },
  {
    id: 3,
    name: 'Nile River Restaurant & Stay',
    type: 'restaurant-hotel',
    location: 'Jinja, Eastern Region',
    rating: 4.3,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    pricePerNight: 4,
    currency: 'CELO',
    description: 'Unique accommodation with authentic Ugandan cuisine. Perfect for adventure seekers exploring the source of the Nile.',
    amenities: ['Local Cuisine', 'River Activities', 'Traditional Decor', 'Guided Tours'],
    available: true
  },
  {
    id: 4,
    name: 'Queen Elizabeth Safari Lodge',
    type: 'hotel',
    location: 'Queen Elizabeth National Park',
    rating: 4.6,
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'],
    pricePerNight: 12,
    currency: 'CELO',
    description: 'Luxury safari experience with wildlife viewing and traditional hospitality.',
    amenities: ['Safari Tours', 'Wildlife Viewing', 'Luxury Rooms', 'Restaurant'],
    available: true
  },
  {
    id: 5,
    name: 'Rural Mbarara Homestay',
    type: 'homestay',
    location: 'Mbarara, Western Region',
    rating: 4.4,
    images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f08af?w=800'],
    pricePerNight: 3,
    currency: 'CELO',
    description: 'Authentic rural living experience with local families. Learn traditional farming and cooking.',
    amenities: ['Homestay', 'Farming Experience', 'Traditional Cooking', 'Local Community'],
    available: true
  },
  {
    id: 6,
    name: 'Lake Victoria Boutique Hotel',
    type: 'hotel',
    location: 'Entebbe, Central Region',
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    pricePerNight: 10,
    currency: 'CELO',
    description: 'Breathtaking lake views with modern amenities. Perfect for relaxation and water activities.',
    amenities: ['Lake View', 'WiFi', 'Beach Access', 'Water Sports', 'Restaurant'],
    available: true
  }
];

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DEPOSITED: 'deposited',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};


