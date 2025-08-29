# Virtual Try-On App

<div align="center">
<img width="1200" height="475" alt="Virtual Try-On Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

**An AI-powered virtual try-on application that lets users see how clothing looks on them using photorealistic image generation.**

## 🌟 Features

- **AI-Powered Virtual Try-On**: Uses Google Gemini AI to generate realistic clothing visualizations
- **Advanced Image Cropping**: Built-in image cropping tool with multiple aspect ratios (1:1, 3:4, 4:3, 9:16, 16:9, Free)
- **Body Type Support**: Configurable body build options (Slim, Athletic, Average, Curvy, Plus Size)
- **Drag & Drop Upload**: Easy file upload with drag-and-drop functionality
- **Real-time Processing**: Progressive loading with contextual status messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **High-Quality Output**: Photorealistic results with proper lighting, shadows, and fabric draping

## 🚀 Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI Service**: Google Gemini 2.5 Flash Image Preview
- **Image Processing**: React Image Crop, HTML5 Canvas API
- **File Handling**: Browser File API with object URLs

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Google Gemini API Key** - Get yours from [Google AI Studio](https://aistudio.google.com/)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd virtual-try-on
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5000` to see the application

## 🎯 How to Use

1. **Upload Your Photo**: Click or drag-and-drop your photo in the first upload area
2. **Crop Your Image**: Use the built-in cropping tool to frame your photo perfectly
3. **Upload an Outfit**: Add the clothing item you want to try on in the second upload area
4. **Select Body Type**: Choose the body build that best matches your physique
5. **Generate Try-On**: Click "Try It On!" and wait for the AI to create your virtual fitting
6. **Download or Try More**: Save your result or try different outfits

## 🏗️ Project Structure

```
virtual-try-on/
├── components/           # React components
│   ├── Header.tsx       # App header with title and description
│   ├── ImageUploader.tsx # File upload with cropping functionality
│   ├── Spinner.tsx      # Loading animation
│   └── ...
├── services/
│   └── geminiService.ts # Google Gemini AI integration
├── assets/              # Static assets (sample images)
├── App.tsx             # Main application component
├── index.tsx           # React app entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Key Components

### ImageUploader
- Supports PNG, JPG, and JPEG formats
- Drag-and-drop interface
- Advanced cropping with multiple aspect ratios
- File type validation with user-friendly error messages

### Gemini Service
- Image preprocessing (resizing, padding)
- AI prompt engineering for realistic try-on results
- Post-processing to maintain original aspect ratios
- Error handling and retry logic

### App Architecture
- Progressive loading states with contextual messages
- Clean state management using React hooks
- Responsive design with Tailwind CSS
- Comprehensive error handling

## 🌐 Deployment

This app is configured for easy deployment on platforms like Replit, Vercel, or Netlify.

**For Replit deployment:**
- The app is pre-configured to run on port 5000
- Environment variables are automatically loaded
- Build and preview commands are set up for production deployment

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache 2.0 License - see the license headers in individual files for details.

## 🙏 Acknowledgments

- Google AI for the Gemini API
- React Image Crop library for the cropping functionality
- Tailwind CSS for the styling framework
- The open-source community for various tools and libraries

---

**Need help?** Check the console for error messages or create an issue in the repository.
