# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# React Native Posts CRUD App 📱

A full-stack React Native application built with Expo for managing posts with CRUD operations and drag-and-drop reordering.

## 📦 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/jcreforme/react-native-posts-crud.git
cd react-native-posts-crud

# Install frontend dependencies
cd MyApp
npm install
cd ..

# Install backend dependencies
cd dummy-backend
npm install
cd ..
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local IP address
# Windows: ipconfig
# Mac/Linux: ifconfig
```

Update `LOCAL_IP` in `.env` with your computer's IP address.

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd dummy-backend
node app.js
```

**Terminal 2 - Frontend:**
```bash
cd MyApp
npx expo start
```

## 🚀 Running on Mobile

1. Install **Expo Go** on your phone
2. Ensure phone and computer are on same Wi-Fi
3. Scan QR code from terminal
4. App will auto-connect to backend

No manual IP configuration needed - it auto-detects!

## 📁 Project Structure

```
├── MyApp/              # Expo frontend
├── dummy-backend/      # Express backend
├── .env.example        # Environment template
└── README.md          # This file
```

## 🔧 Environment Variables

Create `.env` file from `.env.example`:

```bash
LOCAL_IP=192.168.20.114          # Your computer's IP
BACKEND_PORT=8080                # Backend port
EXPO_PUBLIC_API_URL=http://192.168.20.114:8080/posts
```

## ✨ Features

- Create, edit, delete posts
- Drag-and-drop reordering (mobile)
- Cross-platform (iOS, Android, Web)
- Auto-detecting API URL
- Persistent storage

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)

## 📄 License

Educational purposes
