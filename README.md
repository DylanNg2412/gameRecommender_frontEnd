# 🎮 Game Finder - Game Recommendation System

A modern, responsive React-based frontend application that helps users discover their next favorite game based on their preferences. Built with Material-UI and powered by a Flask backend recommendation engine.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-7.0.2-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-79.3%25-yellow)

## ✨ Features

- 🔍 **Smart Search**: Autocomplete search with a comprehensive game database
- 🎯 **Personalized Recommendations**: Get game suggestions based on your favorite games
- 🌓 **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- 📊 **Detailed Game Info**: View game scores, release dates, prices, genres, and tags
- 📱 **Responsive Design**: Fully responsive UI that works on all devices
- ⚡ **Real-time Feedback**: Loading states and notifications for better UX
- 🎨 **Modern UI**: Beautiful gradient designs with smooth animations and transitions

## 🚀 Demo

The application allows users to:

1. Search for a game they love using the autocomplete search bar
2. Get AI-powered recommendations based on their selection
3. View detailed information about recommended games including:
   - Game scores with color-coded ratings
   - Release dates
   - Pricing information
   - Genres and tags
   - Review counts and popularity metrics

## 🛠️ Tech Stack

- **React** 18.3.1 - UI library
- **Material-UI** 7.0.2 - Component library
- **React Router** 7.0.2 - Navigation
- **Axios** - HTTP client for API requests
- **TanStack Query** - Data fetching and caching
- **Emotion** - CSS-in-JS styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running Flask backend (see Backend Setup section)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DylanNg2412/gameRecommender_frontEnd.git
   cd gameRecommender_frontEnd
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the backend URL** (if needed)

   The application is configured to connect to a Flask backend at `http://127.0.0.1:5000`.

   If your backend runs on a different URL, update it in `src/utils/api.js`:

   ```javascript
   const api = axios.create({
     baseURL: "http://your-backend-url:port",
   });
   ```

## 🎬 Running the Application

### Development Mode

```bash
npm start
```

- Opens the app at [http://localhost:3000](http://localhost:3000)
- The page will reload when you make changes
- Lint errors will appear in the console

### Production Build

```bash
npm run build
```

Builds the app for production to the `build` folder:

- Bundles React in production mode
- Optimizes the build for best performance
- Minifies files and includes hashes in filenames

### Run Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

## 🔌 Backend Setup

This frontend requires a Flask backend to function. The backend should provide two endpoints:

1. **GET** `/games` - Returns a list of available games

   ```json
   {
     "games": ["Game 1", "Game 2", "Game 3"]
   }
   ```

2. **POST** `/recommend` - Returns game recommendations
   ```json
   {
     "selectedGame": "The Witcher 3"
   }
   ```
   Response:
   ```json
   {
     "recommendations": [
       {
         "name": "Game Name",
         "release_date": "2020-01-01",
         "price": "$59.99",
         "score": 85,
         "genres": "Action, RPG, Adventure",
         "tags": "Open World, Story Rich, Fantasy",
         "reviews": 50000,
         "popularity": "Very Popular"
       }
     ]
   }
   ```

Make sure your Flask backend is running on `http://127.0.0.1:5000` before starting the frontend.

## 📁 Project Structure

```
gameRecommender_frontEnd/
├── public/
│   ├── index.html          # HTML template
│   └── ...
├── src/
│   ├── pages/
│   │   └── HomePage/
│   │       └── index.js    # Main page component
│   ├── utils/
│   │   └── api.js          # Axios configuration
│   ├── App.js              # Main App component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Key Features Explained

### Autocomplete Search

- Type-ahead search with game suggestions
- Supports free text input for games not in the database
- Visual icons and smooth animations

### Recommendation System

- Connects to ML-powered backend
- Displays top game recommendations
- Shows comprehensive game metadata

### Theme Toggle

- Switch between light and dark modes
- Smooth transitions between themes
- Persistent gradient header design

### Responsive Cards

- Hover effects with elevation changes
- Color-coded score chips (green for 80+, yellow for 60-79, red for below 60)
- Organized display of genres and tags

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**DylanNg2412**

- GitHub: [@DylanNg2412](https://github.com/DylanNg2412)

## 🙏 Acknowledgments

- Built with [Create React App](https://github.com/facebook/create-react-app)
- UI components from [Material-UI](https://mui.com/)
- Icons from [Material Icons](https://mui.com/material-ui/material-icons/)

---

⭐️ If you find this project helpful, please consider giving it a star!
