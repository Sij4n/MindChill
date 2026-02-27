# Mind Chill 🌿

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

> **Mind Chill** is a curated, immersive workspace designed to enhance focus, relaxation, and productivity. Combining aesthetic pixel art visuals with high-quality lo-fi beats, it provides a cozy virtual environment for study, work, or meditation.

---

## 📸 Preview

<img width="1902" height="1033" alt="image" src="https://github.com/user-attachments/assets/6052a134-d714-4cd4-b4dc-9f1caa8ffb80" />


---

## ✨ Features

- **🎧 Curated Lofi Streams**: Seamlessly switch between high-quality lofi stations with custom backdrops.
- **⏱️ Pomodoro Timer**: Provides specific focus intervals with a built-in timer to boost productivity.
- **📝 Integrated Todo List**: Persist tasks locally and track your daily progress.
- **📹 Study With Me**: Peer-to-peer video calling capability for remote study sessions (powered by PeerJS).
- **🖥️ Fullscreen Mode**: Immerse yourself with one click or keypress (`F`).
- **🖼️ Interactive Backdrops**: Click anywhere on the background to cycle through curated GIF environments.
- **⚙️ Settings Panel**: Access a dedicated menu to switch stations and backdrops.
- **ℹ️ About Modal**: In-app documentation for shortcuts and project details.
- **⚡ Glassmorphism UI**: Modern, translucent interface elements for a premium feel.

## ⌨️ Keyboard Shortcuts

- **Space**: Play / pause music
- **G**: Shuffle / change backdrop
- **M**: Mute / unmute audio
- **C / P**: Toggle Pomodoro timer
- **T**: Toggle Todo list
- **F**: Toggle Fullscreen mode

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) (v19)
- **Styling**: Custom CSS3 (Variables, Flexbox, Grid, Glassmorphism)
- **Video Integration**: `react-youtube`
- **P2P Communication**: `peerjs`
- **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Sij4n/MindChill.git
    cd MindChill
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**
    ```bash
    npm start
    # or
    yarn start
    ```

    The application will open automatically at `http://localhost:3000`.

## 📂 Project Structure

```bash
mind-chill/
├── public/
│   ├── index.html       # Entry point
│   └── manifest.json    # App metadata
├── src/
│   ├── components/      # UI Components
│   │   ├── MusicPlayer/ # Main Player Logic, Backdrops & Ticker
│   │   ├── PomodoroTimer/    # Timer Logic
│   │   ├── TodoList/    # Task Management
│   │   └── VideoCall/   # PeerJS Implementation
│   ├── App.js           # Main Layout, Modals & Fullscreen Logic
│   ├── App.css          # App-wide Styles & Theme
│   ├── index.js         # DOM Rendering
│   └── index.css        # Global Variables & Reset
├── README.md            # Documentation
└── package.json         # Dependencies & Scripts
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Developed with ❤️ by [Sijan Pradhan](https://github.com/Sij4n)**

*Stay Cozy.*

</div>
