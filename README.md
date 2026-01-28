# CampusHire AI - Campus Interview Preparation Platform

A comprehensive full-stack application designed to help students prepare for campus interviews with AI-powered features, experience sharing, and company insights.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup/login with OTP verification
- **Experience Sharing**: Students can share and learn from interview experiences
- **AI Chatbot**: Intelligent assistant for interview preparation
- **Company Database**: Comprehensive company information and insights
- **Admin Panel**: Administrative controls and analytics

### Technical Stack
- **Backend**: FastAPI (Python) with SQLAlchemy
- **Frontend**: React + TypeScript + Vite
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens with email OTP
- **Styling**: Tailwind CSS with custom animations

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Configure environment variables in .env
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL=sqlite:///./campushire.db
SECRET_KEY=your-secret-key-here
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_PASSWORD=admin123
```

## 📁 Project Structure

```
campushire-ai/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── core/            # Configuration & utilities
│   │   ├── db/              # Database models & connection
│   │   ├── schemas/         # Pydantic models
│   │   └── services/        # Business logic
│   ├── alembic/             # Database migrations
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   └── store/           # State management
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/verify-otp` - OTP verification
- `POST /api/v1/auth/login` - User login

### Experiences
- `GET /api/v1/experiences` - Get all experiences
- `POST /api/v1/experiences` - Create new experience
- `PUT /api/v1/experiences/{id}` - Update experience

### Companies
- `GET /api/v1/companies` - Get company information
- `POST /api/v1/companies` - Add new company

### AI Chatbot
- `POST /api/v1/chatbot/chat` - Interact with AI assistant

## 🚀 Deployment

### Local Development
1. Start backend: `cd backend && python -m uvicorn main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Access at: http://localhost:3000

### Production Deployment
- Backend: Deploy to services like Railway, Render, or Heroku
- Frontend: Deploy to Vercel, Netlify, or GitHub Pages
- Database: Use PostgreSQL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Atharva Adkar** - *Initial work* - [aadkar240](https://github.com/aadkar240)

## 🙏 Acknowledgments

- FastAPI for the amazing Python web framework
- React for the frontend framework
- Tailwind CSS for styling
- All contributors and open-source projects used

---

**Made with ❤️ for campus interview preparation**