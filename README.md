# 🌍 Uganda Tourism Booking Platform

A blockchain-powered booking platform for rural tourism in Uganda, powered by Celo.

## 🎯 Project Vision

Enable reliable tourism bookings in rural Uganda through:
- **Secure Payments**: CELO held in smart contract escrow
- **Transparent Process**: All bookings recorded on-chain
- **Full Service**: We handle booking & guide you through arrival
- **Rural Focus**: Hotels, homestays, and restaurants across Uganda

## ✨ Features

### Current Implementation (Frontend)

- ✅ **Browse Accommodations**: Explore hotels, homestays, and restaurants
- ✅ **Wallet Integration**: Connect Celo-compatible wallets
- ✅ **Booking System**: Select dates, calculate prices, create bookings
- ✅ **User Dashboard**: Track all bookings with status indicators
- ✅ **Search & Filter**: Find accommodations by type and location
- ✅ **Responsive Design**: Works on all devices
- ✅ **Local Storage**: Persists bookings locally

### Planned Implementation (Smart Contract)

- ⏳ **Escrow Contract**: Secure CELO deposits on-chain
- ⏳ **Payment Release**: Automatic release after stay completion
- ⏳ **Dispute Resolution**: Contract-mediated conflicts
- ⏳ **Admin Dashboard**: Manage bookings and releases

## 🏗️ Architecture

```
Frontend (Vanilla JS)
    ↓
Wallet Connection (Celo/Valora)
    ↓
Smart Contract (Celo Network)
    ↓
Funds Escrow & Release
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Celo-compatible wallet (Valora recommended)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Connect Your Wallet

1. Open Valora or Celo Wallet
2. Navigate to Alfajores testnet
3. Get testnet CELO from [Faucet](https://faucet.celo.org/)
4. Connect wallet in the app

## 📂 Project Structure

```
my-project/
├── src/
│   ├── config/           # Constants, ABI, network config
│   ├── pages/            # Home, Browse, Details, Dashboard
│   ├── components/       # Navbar, AccommodationCard
│   ├── utils/            # Wallet, storage utilities
│   ├── main.js           # App entry & routing
│   └── style.css         # Styling
├── index.html
├── package.json
└── ARCHITECTURE.md       # Detailed technical docs
```

## 🌐 Network Configuration

**Testnet (Development)**: Celo Alfajores
- Chain ID: 44787
- RPC: https://alfajores-forno.celo-testnet.org
- Explorer: https://alfajores.celoscan.io

**Mainnet (Production)**: Celo
- Chain ID: 42220
- RPC: https://forno.celo.org
- Explorer: https://celoscan.io

## 💰 Sample Accommodations

The platform includes sample listings for:
- **Kampala Paradise Hotel** (Central)
- **Bwindi Mountain Lodge** (Homestay near gorillas)
- **Nile River Restaurant & Stay** (Jinja)
- **Queen Elizabeth Safari Lodge** (National Park)
- **Rural Mbarara Homestay** (Western Region)
- **Lake Victoria Boutique Hotel** (Entebbe)

## 🎨 Features in Detail

### 1. Browse Page
- Filter by accommodation type
- Search by location
- View detailed cards with pricing
- Click to view full details

### 2. Accommodation Details
- Calendar-based date selection
- Automatic price calculation
- Wallet balance display
- One-click deposit (ready for blockchain)

### 3. Booking Dashboard
- View all bookings
- Track booking status
- View statistics
- Quick re-book functionality

### 4. Smart Contract Flow
1. User creates booking
2. Deposits CELO to escrow contract
3. Admin books accommodation
4. User completes stay
5. Admin releases funds

## 🔒 Security

- All payments through smart contract escrow
- No central custody of funds
- Transparent on-chain record
- Admin-only fund release

## 📝 Development Roadmap

### Phase 1: Frontend ✅
- [x] UI implementation
- [x] Wallet integration
- [x] Booking system
- [x] Local storage

### Phase 2: Smart Contract (Next)
- [ ] Write escrow contract
- [ ] Deploy to Alfajores
- [ ] Test deposit/release flow
- [ ] Integrate with frontend

### Phase 3: Enhanced Features
- [ ] Admin dashboard
- [ ] Property owner registration
- [ ] Reviews & ratings
- [ ] Mobile app

### Phase 4: Production
- [ ] Deploy to Celo mainnet
- [ ] Security audit
- [ ] Marketing & partnerships
- [ ] Launch in Uganda

## 🛠️ Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Variables
- **Build Tool**: Vite
- **Blockchain**: Celo Network
- **Wallet**: Valora/Celo Wallet
- **Storage**: LocalStorage (for now)

## 👥 Contributing

This project is designed for rural tourism empowerment in Uganda. Contributions welcome!

## 📄 License

MIT License - Feel free to use and modify

## 🙏 Acknowledgments

- Celo Foundation for blockchain infrastructure
- Valora team for mobile wallet
- Uganda Tourism Board

## 📧 Contact

For questions about this implementation, please refer to the ARCHITECTURE.md file for detailed technical documentation.

---

**Powered by Celo** 🌾 | **Made for Uganda** 🇺🇬



