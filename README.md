# Radio Player App

A modern, responsive radio player application built with React, TypeScript, and TailwindCSS. Works seamlessly on both desktop and mobile devices.

## Features

- 🎵 **Single Radio Station Player** - Stream your favorite radio station
- 🎨 **Modern UI Design** - Beautiful gradient design with smooth animations
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🔊 **Volume Control** - Adjustable volume with mute functionality
- ⚡ **Live Status Indicator** - Visual feedback when streaming is active
- 🎯 **Simple Controls** - Easy-to-use play/pause button
- 🌐 **Cross-Browser Compatible** - Works on all modern browsers

## Screenshots

The app features:
- Animated radio icon that pulses when playing
- Live streaming indicator
- Smooth gradient background
- Intuitive volume slider
- Loading states for better UX

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your radio stream:**
   
   Open `src/App.tsx` and update the following constants with your radio station details:
   
   ```typescript
   const RADIO_STREAM_URL = 'https://stream.example.com/radio' // Your stream URL
   const STATION_NAME = 'My Radio Station'
   const STATION_TAGLINE = 'Your favorite music, all day long'
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Configuration

### Radio Stream URL

The app supports various audio stream formats:
- MP3 streams (e.g., `.mp3`, `/stream`)
- AAC streams
- HLS streams (`.m3u8`)
- Other HTML5 audio-compatible formats

### Customization

You can customize the app by modifying:

- **Colors**: Update the gradient colors in `src/App.tsx`
- **Station Info**: Change `STATION_NAME` and `STATION_TAGLINE`
- **Styling**: Modify TailwindCSS classes or add custom CSS

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Stream Not Playing

1. **Check CORS**: Ensure your radio stream server allows CORS requests
2. **HTTPS**: If your app is served over HTTPS, the stream URL must also be HTTPS
3. **Format**: Verify the stream format is supported by HTML5 audio
4. **Browser Console**: Check for error messages in the browser console

### Audio Autoplay Issues

Some browsers block autoplay. Users need to interact with the page (click play) before audio can start.

## Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Framework preset: Vite
4. Deploy

### Deploy to XAMPP (Local)

1. Build the project: `npm run build`
2. Copy contents of `dist` folder to your XAMPP `htdocs` directory
3. Access via `http://localhost/radioapp`

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using React and TypeScript
