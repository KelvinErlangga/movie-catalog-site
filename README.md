# 🎬 CinemaVin - Movie Catalog Website

A modern and responsive movie catalog website built with React that provides comprehensive movie information, search functionality, and filtering options. Discover trending movies, explore detailed information, and find your next favorite film with an intuitive user interface.

## 📋 Table of Contents

1. [Features](#features)
2. [APIs Used](#apis-used)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Environment Setup](#environment-setup)
6. [Available Scripts](#available-scripts)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)

## ✨ Features

1. **🏠 Home Page** - Display now playing, popular, and top-rated movies
2. **🔍 Advanced Search** - Search movies by title with real-time results
3. **🎭 Genre Filtering** - Filter movies by different genres
4. **📅 Year Filtering** - Browse movies by release year
5. **🌍 Country Filtering** - Filter movies by production country
6. **📱 Responsive Design** - Optimized for all device sizes
7. **🌓 Dark/Light Mode** - Toggle between themes
8. **🌍 Multi-language Support** - Internationalization with i18next
9. **📄 Detailed Movie Pages** - View comprehensive movie information
10. **⚡ Session Storage** - Persistent search and filter states

## 🔌 APIs Used

1. **The Movie Database (TMDB) API**
   - Base URL: `https://api.themoviedb.org/`
   - Features:
     - Movie discovery and listing
     - Detailed movie information
     - Search functionality
     - Genre and filtering options
   - Documentation: [TMDB API Docs](https://developers.themoviedb.org/)

## 🛠 Tech Stack

### Frontend Framework
- **React 19.0.0** - Modern React with latest features
- **React Router DOM 6.22.0** - Client-side routing

### UI & Styling
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **Bootstrap 5.3.3** - Responsive UI components
- **React Bootstrap 2.10.0** - Bootstrap components for React
- **React Icons 5.0.1** - Icon library
- **React Awesome Reveal 4.2.14** - Animation library
- **React Responsive Carousel 3.2.23** - Image carousel component
- **Slick Carousel 1.8.1** - Slider component

### HTTP Client & Utilities
- **Axios 1.7.9** - HTTP client for API requests
- **dotenv 16.4.1** - Environment variable management

### Internationalization
- **i18next 25.8.4** - Internationalization framework
- **react-i18next 16.5.4** - React integration for i18next
- **i18next-browser-languagedetector 8.2.0** - Browser language detection

### Development & Testing
- **Create React App 5.0.1** - React development environment
- **Testing Library** - Jest, React Testing Library, User Event
- **Web Vitals 2.1.4** - Performance metrics

### Node Environment
- **Node.js 24.x** - JavaScript runtime

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/KelvinErlangga/movie-catalog-site.git
cd movie-catalog-site
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see Environment Setup section)

4. Start the development server:
```bash
npm start
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
REACT_APP_BASEURL=https://api.themoviedb.org/3
REACT_APP_BASEIMGURL=https://image.tmdb.org/t/p/w500
REACT_APP_APIKEY=your_tmdb_api_key_here
REACT_APP_TOKEN=your_tmdb_token_here
```

To get your TMDB API key and token:
1. Sign up at [TMDB](https://www.themoviedb.org/)
2. Go to Settings > API in your account
3. Request an API key for your application
4. Copy your API key (v3 auth) and access token

## 📜 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Carousel.jsx    # Movie carousel component
│   ├── Detail.jsx      # Movie detail page
│   ├── Footer.jsx      # Footer component
│   ├── List.jsx        # Movie list component
│   ├── MovieList.jsx   # Movie list display
│   └── Navbar.jsx      # Navigation bar
├── context/            # React context providers
│   └── ThemeContext.jsx # Theme management context
├── pages/              # Page components
│   └── Home.jsx        # Main home page
├── services/           # API services
│   └── api.js          # TMDB API calls
├── App.jsx             # Main app component
├── i18n.js             # Internationalization configuration
├── index.css           # Global styles
└── index.js            # App entry point
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [React](https://reactjs.org/) for the amazing frontend framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Contact

Kelvin Erlangga - [@your-twitter](https://twitter.com/your-twitter) - your.email@example.com

Project Link: [https://github.com/KelvinErlangga/movie-catalog-site](https://github.com/KelvinErlangga/movie-catalog-site)
