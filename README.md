# 3D Birthday Cake for Zaynab 🎂✨

An interactive 3D birthday cake experience with storytelling, animated candles, and microphone blow detection.

## Features

- 🎨 Beautiful 3D strawberry cake with "Happy Birthday Zaynab" text
- 📖 Story sequence with typewriter effects
- 🕯️ 6 animated candles with realistic flame particles
- 🎤 Microphone blow detection to extinguish candles
- 🎵 Happy Birthday background music
- 🎆 Confetti and fireworks celebration
- 📱 Mobile responsive

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Music

To add your own birthday music:
1. Place an MP3 file in `assets/music/happy-birthday.mp3`
2. Update the music path in `audio.js` (line 93)

Current implementation includes a procedurally generated melody as a placeholder.

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Usage

1. Story sequence plays automatically
2. Allow microphone access when prompted (or skip)
3. Blow into microphone to extinguish candles
4. Enjoy the celebration after all candles are out!

## Technologies

- Three.js - 3D rendering
- Vite - Build tool
- Web Audio API - Music and microphone
- Vanilla JavaScript

## License

MIT

---

Made with ❤️ for Zaynab's 26th Birthday
# Nicks_pizzas_BD
