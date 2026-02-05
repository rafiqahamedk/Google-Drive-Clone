# Google Drive Clone - Frontend

A modern React-based frontend for the Google Drive Clone application.

## Features

- 🔐 User Authentication (Login, Register, Password Reset)
- 📁 File and Folder Management
- ⭐ Starred Files
- 🗑️ Trash/Recycle Bin
- 📤 Drag & Drop File Upload
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design
- 🔔 Toast Notifications
- 🧭 Breadcrumb Navigation

## Tech Stack

- **React** 18.2.0 - UI Library
- **React Router** 6.20.1 - Client-side routing
- **Tailwind CSS** 3.3.6 - Styling
- **Axios** 1.6.2 - HTTP client
- **React Hot Toast** 2.4.1 - Notifications
- **React Dropzone** 14.2.3 - File upload
- **Lucide React** 0.294.0 - Icons
- **React Helmet Async** 2.0.4 - SEO

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
PORT=3001
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3001`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:vercel` - Build for Vercel deployment
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard/      # Dashboard-specific components
│   ├── LandingPage.js  # Landing page component
│   ├── LoadingSpinner.js
│   ├── ProtectedRoute.js
│   └── PublicRoute.js
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Dashboard.js
│   ├── Login.js
│   ├── Register.js
│   ├── Starred.js
│   ├── Trash.js
│   └── ...
├── services/           # API services
│   ├── api.js          # Axios configuration
│   ├── fileService.js  # File operations
│   └── folderService.js # Folder operations
├── App.js              # Main app component
├── index.js            # Entry point
└── index.css           # Global styles
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `/api` |
| `PORT` | Development server port | `3001` |

## Deployment

### Vercel
```bash
npm run build:vercel
```

### Other Platforms
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.