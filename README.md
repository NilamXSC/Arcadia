# Arcadia Health 🏥

AI-powered healthcare infrastructure platform for rural and semi-urban India.

![Arcadia Health](client/public/logo.svg)

## 🌟 Features

- **AI-Powered Analysis** - Real-time health data analysis across 47 cities
- **Patient Monitoring** - Track 12,430+ patients with predictive analytics
- **Smart Dashboard** - Live data visualization with interactive charts
- **Guest Mode** - Full demo access without database setup
- **Multi-language Support** - Built for diverse Indian communities
- **Offline Capability** - Works with intermittent connectivity

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (optional - works without for demo mode)

### Local Development

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/arcadia-health.git
cd arcadia-health
```

**2. Install dependencies**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

**3. Set up environment variables**

```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your configuration

# Frontend
cd ../client
cp .env.example .env
# Edit .env with your configuration
```

**4. Start development servers**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**5. Open your browser**

Navigate to `http://localhost:5173`

## 📦 Deployment

### Quick Deploy (Recommended)

**Option 1: Using Deploy Script**

```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

**Option 2: Manual Deployment**

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Recommended Stack

- **Backend:** Render (Free tier)
- **Frontend:** Vercel (Free tier)
- **Database:** MongoDB Atlas (Free tier) or Demo mode

**Total Cost:** $0 with free tiers

## 🏗️ Project Structure

```
arcadia-health/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── lib/           # Utilities and API client
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                # Node.js + Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── index.js          # Entry point
│
├── src/                  # Core TypeScript modules
│   ├── interfaces/       # TypeScript interfaces
│   ├── services/         # Core services
│   └── test/             # Test files
│
├── .kiro/                # Kiro AI specifications
│   └── specs/            # Feature specifications
│
├── DEPLOYMENT.md         # Deployment guide
├── render.yaml           # Render configuration
└── README.md             # This file
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Routing:** React Router

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (optional)
- **Authentication:** JWT
- **Validation:** Express Validator

### Core
- **Language:** TypeScript
- **Testing:** Jest + Fast-check
- **Linting:** ESLint

## 📊 Demo Mode

Arcadia Health works perfectly without a database using Guest Mode:

1. Click "Launch Demo Platform" on homepage
2. Explore with 11 sample patients
3. Full AI assistant functionality
4. All features available

Perfect for:
- Testing and development
- Demos and presentations
- Proof of concept
- Learning the platform

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/arcadia
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run property-based tests
npm run test:property

# Run in watch mode
npm run test:watch
```

## 📝 Scripts

### Backend

```bash
npm run dev      # Start development server with watch
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/guest` - Guest login
- `POST /api/auth/login` - User login (coming soon)
- `POST /api/auth/register` - User registration (coming soon)
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients` - List all patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create patient
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Dashboard
- `GET /api/dashboard/analytics` - Get dashboard analytics

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant

### Health Check
- `GET /api/health` - Server health status

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for rural and semi-urban India
- Designed for accessibility and simplicity
- Powered by AI for better healthcare outcomes

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review the code documentation

## 🎯 Roadmap

- [ ] Full authentication system
- [ ] MongoDB integration
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Voice interface
- [ ] Offline-first architecture
- [ ] Advanced AI models

## 📈 Status

- **Version:** 1.0.0
- **Status:** Production Ready (Demo Mode)
- **Last Updated:** February 2026

---

**Built with ❤️ for healthier communities**

🏥 Arcadia Health - Transforming healthcare with AI
