# StyleAI - Virtual Styling Assistant

<div align="center">
<img width="1200" height="475" alt="StyleAI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

**A comprehensive AI-powered styling assistant that provides virtual try-on, hair styling, background changing, and outfit extraction using cutting-edge AI technology.**

## 🌟 Features

### 🎽 Virtual Try-On
- **AI-Powered Clothing Visualization**: See how any outfit looks on you with photorealistic results
- **Multiple Viewing Angles**: Front, side, 3/4, and back views for complete outfit assessment
- **Body Type Support**: Accurate fitting for different body builds (Slim, Athletic, Average, Curvy, Plus Size)
- **Color Customization**: Recolor outfits to match your preferred colors
- **Natural Language Editing**: Fine-tune results with custom prompts

### 👔 Outfit Extraction
- **AI-Powered Extraction**: Extract clothing items from your photos for virtual try-on
- **Product-Style Results**: Clean, professional images suitable for virtual fitting
- **Save Functionality**: Download extracted outfits for future use
- **Seamless Integration**: Automatically loads extracted outfits for immediate try-on

### 💇 Hair & Beard Styling
- **Reference-Based Styling**: Apply hairstyles from reference images
- **Style Description**: Create new looks using natural language descriptions
- **Gender-Specific Options**: Tailored styling for masculine, feminine, or unisex looks
- **Professional Results**: Realistic hair textures, colors, and styling

### 🌄 Background Changer
- **Environment Replacement**: Place yourself in any setting or environment
- **Auto & Manual Placement**: AI-assisted or user-directed positioning
- **Realistic Integration**: Natural lighting, shadows, and perspective matching
- **Creative Freedom**: From professional settings to fantasy worlds

### 📱 Mobile-First Design
- **Responsive Interface**: Optimized for mobile devices and tablets
- **Touch-Friendly Navigation**: Large touch targets and smooth interactions
- **Bottom Tab Navigation**: Easy access to all features with themed colors
- **Progressive Web App**: Install on your device for app-like experience

## 🚀 Tech Stack

### Frontend Architecture
- **React 19** with TypeScript for modern component development
- **React Router DOM** for seamless multi-page navigation
- **Tailwind CSS** for responsive design and modern UI components
- **Framer Motion** for smooth animations and transitions
- **Vite** for fast development and optimized builds

### AI Integration
- **Google Gemini 2.5 Flash Image Preview** via OpenRouter API
- **Professional Prompt Engineering** with photography terminology
- **Multi-Modal Processing** supporting both images and text
- **Advanced Error Handling** with user-friendly messages

### Image Processing
- **React Image Crop** for advanced cropping functionality
- **HTML5 Canvas API** for image manipulation
- **Browser File API** for secure file handling
- **Multiple Format Support** (PNG, JPG, JPEG)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **OpenRouter API Key** - Get yours from [OpenRouter.ai](https://openrouter.ai)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd styleai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   - Get an OpenRouter API key from [OpenRouter.ai](https://openrouter.ai)
   - Open the app and go to Settings
   - Enter your API key and click "Save API Key"

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to see the application

## 🎯 How to Use

### Virtual Try-On
1. **Upload Your Photo**: Take or select a photo of yourself
2. **Crop Your Image**: Frame yourself perfectly using the cropping tool
3. **Add Outfit**: Upload a clothing item or extract one from another photo
4. **Select Options**: Choose viewing angle and body type
5. **Generate**: Click "Try It On!" and watch the AI create your virtual fitting

### Outfit Extraction
1. **Upload Photo**: Use a photo where you're wearing the outfit you want to extract
2. **Extract Outfit**: Click "Extract Outfit from My Photo"
3. **Save Result**: Download the clean outfit image for future use
4. **Virtual Try-On**: The extracted outfit automatically loads for immediate try-on

### Hair Styling
1. **Upload Your Photo**: Provide a clear photo of yourself
2. **Choose Style Method**: Use a reference image or describe your desired style
3. **Set Preferences**: Select gender and add custom styling notes
4. **Generate**: Let the AI transform your hairstyle

### Background Changer
1. **Upload Your Photo**: Start with any photo of yourself
2. **Describe Environment**: Tell the AI where you want to be placed
3. **Choose Placement**: Let AI decide or provide specific instructions
4. **Create Scene**: Generate your new environment

## 🏗️ Project Structure

```
styleai/
├── components/              # Reusable React components
│   ├── SplashScreen.tsx    # App initialization screen
│   ├── TabNavigation.tsx   # Bottom navigation bar
│   ├── ImageUploader.tsx   # File upload with cropping
│   └── LandingScreen.tsx   # First-time user onboarding
├── pages/                  # Page components for each feature
│   ├── HomePage.tsx        # Welcome screen and feature overview
│   ├── VirtualTryOnPage.tsx# Virtual try-on interface
│   ├── HairStylePage.tsx   # Hair styling interface
│   ├── BackgroundPage.tsx  # Background changing interface
│   ├── AboutPage.tsx       # App information and credits
│   └── SettingsPage.tsx    # API key management and preferences
├── services/               # AI integration services
│   ├── geminiService.ts    # Core AI functionality
│   ├── optimizedGeminiService.ts # Optimized prompt templates
│   └── enhancedGeminiService.ts # Multi-feature support
├── contexts/               # Global state management
│   └── AppContext.tsx      # Application-wide state and functions
├── assets/                 # Static assets and sample images
├── App.tsx                # Main application component with routing
├── index.tsx              # React app entry point
└── vite.config.ts         # Build configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Key Features

### Advanced AI Prompts
- **Professional Photography Terminology** for high-quality results
- **Body Type Fidelity** ensuring realistic clothing fit
- **Lighting and Shadow Matching** for seamless integration
- **Multiple Viewing Angles** for comprehensive visualization

### User Experience
- **Progressive Loading** with contextual status messages
- **Drag & Drop Interface** for easy file uploads
- **Image Gallery** to save and manage generated results
- **Mobile-Optimized** touch interface

### Error Handling
- **Comprehensive Error Messages** with clear explanations
- **API Key Validation** with helpful setup instructions
- **File Format Validation** with user-friendly guidance
- **Network Error Recovery** with retry mechanisms

## 🌐 Deployment

This application is optimized for deployment on modern hosting platforms:

### Replit Deployment
- Pre-configured to run on port 5000
- Environment variable support
- Automatic dependency management

### Other Platforms
- Compatible with Vercel, Netlify, and other static hosts
- Build optimization for fast loading
- Progressive Web App features

## 🔐 Configuration

### API Keys
The application uses OpenRouter API for accessing Google's Gemini AI model:
- Sign up at [OpenRouter.ai](https://openrouter.ai)
- Get your API key from the dashboard
- Configure it in the app's Settings page

### Storage
- **API Key**: Stored securely in browser localStorage
- **Generated Images**: Temporarily stored in browser memory
- **User Preferences**: Saved locally for personalized experience

## 📱 Mobile Features

### Progressive Web App
- Install on mobile devices for app-like experience
- Offline capability for basic functionality
- Push notifications for updates (future feature)

### Touch Optimizations
- Large touch targets for easy interaction
- Gesture support for image manipulation
- Haptic feedback on supported devices

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write clear, descriptive commit messages
- Add comments for complex functionality

## 📄 License

This project is licensed under the Apache 2.0 License - see the license headers in individual files for details.

## 👨‍💻 Developer

**StyleAI** was developed with ❤️ by [**SALAH.A**](https://github.com/Salahalioui)

- **GitHub**: [Salahalioui](https://github.com/Salahalioui)
- **Facebook**: [SALAH.ALIOUI32](https://www.facebook.com/SALAH.ALIOUI32)

*Full-Stack Developer & AI Enthusiast passionate about creating innovative AI-powered applications that make technology accessible and fun for everyone.*

## 🙏 Acknowledgments

- **Google AI** for the Gemini 2.5 Flash Image Preview model
- **OpenRouter** for providing reliable AI model access
- **React Team** for the amazing React 19 framework
- **Tailwind CSS** for the utility-first styling approach
- **Framer Motion** for smooth animations
- **Open Source Community** for the incredible tools and libraries

## 🆘 Support

Need help? Here are your options:

1. **Check the About page** in the app for feature explanations
2. **Review error messages** in the console for technical issues
3. **Verify your API key** in Settings if features aren't working
4. **Create an issue** in the repository for bugs or feature requests

---

**Ready to transform your style with AI?** 🎨✨

*Visit the About page in the app to learn more about StyleAI's capabilities and features!*