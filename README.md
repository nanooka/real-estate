# PrimeEstate 🏠

**PrimeEstate** is a full-featured real estate web application where users can explore properties, add listings, chat with other users, and filter results with advanced search options. The platform includes real-time communication, Google OAuth, and interactive map views — all in a modern, responsive UI.

## 🔗 Live Demo

- 🌐 Frontend: [Netlify App](https://prime-estate-nanooka.netlify.app/)
- ⚙️ Backend API: [Render API](https://real-estate-nanooka.onrender.com/)
- 💬 Socket Server: [Socket.IO Server](https://real-estate-socket-v13t.onrender.com/)

## 🧰 Tech Stack

- **Frontend**: React (Vite), React Router, SCSS
- **Backend**: Node.js, Express, MongoDB, Prisma
- **Authentication**: Google OAuth, JWT, bcrypt
- **Real-time**: Socket.IO
- **Other**: Responsive design with light & dark mode

## 💡 Features

- 🔐 User registration (email/password & Google OAuth)
- 🏘️ Browse listings with map view
- 💾 Save properties to favorites
- 🏡 Add your own listings
- 💬 Chat in real-time with listing authors
- 🎯 Filter listings by:
  - Status (sale / rent)
  - Location (country & city)
  - Property type (apartment / house)
  - Price range
  - Area (m²)
  - Number of bedrooms
- 🌙 Light and dark mode toggle

## 🚀 Getting Started

### Project Structure

prime-estate/ ├── api # Express + MongoDB + Prisma backend ├── client # Vite + React frontend └── socket # Socket.IO server for real-time chat

### Installation

1. Clone the repository:

```
    git clone <your-repo-url>
    cd prime-estate
```

2. Install dependencies and run each part:

```
cd api
npm install
npm run dev
```

```
cd socket
npm install
npm run dev
```

```
cd client
npm install
npm run dev
```

3. Make sure to create `.env` files in each folder with the necessary environment variables.

## 🤝 Contributing

Contributions are welcome! If you have ideas to improve this project, feel free to fork it and submit a pull request. Let's build something great together!
