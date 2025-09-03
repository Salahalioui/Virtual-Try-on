# StyleAI - Virtual Styling Assistant

## Overview

StyleAI is a comprehensive mobile-first React application that provides AI-powered styling services. The app features multiple tabs for different styling needs: Virtual Try-On for clothing visualization, Hair & Beard Styling for hairstyle transformations, and Background Changer for environment modifications. Built with modern web technologies and powered by Google's Gemini 2.5 Flash Image Preview model via OpenRouter API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM for multi-page navigation and tab management
- **Styling**: Tailwind CSS for responsive design and modern UI components
- **Animations**: Framer Motion for smooth transitions and interactive elements
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: Context API for global state management across all tabs
- **Image Processing**: React Image Crop library for user photo cropping functionality

### Component Structure
**Core Components:**
- **App.tsx**: Main application component with routing and splash screen management
- **SplashScreen.tsx**: Loading screen with branding and initialization animations
- **TabNavigation.tsx**: Mobile-first bottom navigation with animated tab switching
- **ImageUploader.tsx**: Enhanced file upload component with drag-and-drop and cropping

**Page Components:**
- **VirtualTryOnPage.tsx**: Complete virtual try-on experience with multiple angles and AI-powered outfit extraction
- **HairStylePage.tsx**: Hair and beard styling with preset styles and custom prompts  
- **BackgroundPage.tsx**: Background replacement with automatic and manual placement options
- **SettingsPage.tsx**: API key management and user preferences

**Context & State:**
- **AppContext.tsx**: Global state management for all features and user data

### AI Integration
- **Original Service**: geminiService.ts for core AI model integration via OpenRouter
- **Enhanced Service**: enhancedGeminiService.ts for multi-feature support (virtual try-on, hair styling, background changes)
- **Primary Model**: Google's Gemini 2.5 Flash Image Preview via OpenRouter API
- **Multi-Feature Support**:
  - Virtual Try-On with multiple angle views (front, side, 3/4, back)
  - Hair & Beard Styling with gender-specific presets and custom descriptions
  - Background Replacement with automatic placement and custom prompts
  - AI-Powered Outfit Extraction using Gemini 2.5 Flash Image Generation
- **Enhanced Features**:
  - Natural language editing prompts for fine-tuning results
  - Progressive loading with contextual messages for each feature
  - Body type support for virtual try-on accuracy

### Data Flow
- **File Handling**: Browser File API for image uploads and processing
- **Image Rendering**: Object URLs for efficient client-side image display
- **Error Handling**: Comprehensive error states with user-friendly messaging
- **Loading States**: Progressive feedback system with contextual loading messages

## External Dependencies

### Core Libraries
- **React & React DOM**: Frontend framework and rendering (v19.1.0)
- **React Router DOM**: Client-side routing for multi-page navigation
- **TypeScript**: Type safety and enhanced developer experience (v5.8.2)
- **Vite**: Development server and build tooling (v6.2.0)
- **Framer Motion**: Animation library for smooth transitions and interactions
- **React Icons**: Icon library for consistent UI elements

### AI Services
- **OpenRouter**: API gateway for accessing Google's Gemini 2.5 Flash Image Preview model
- **Google Gemini 2.5 Flash Image Preview**: AI model for image generation and virtual try-on processing
- **API Key Management**: OpenRouter API key required for authentication

### UI Libraries
- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **React Image Crop**: Advanced image cropping functionality (v11.0.6)
- **Google Fonts**: Inter font family for consistent typography

### Development Tools
- **ESM Imports**: Modern ES module system with importmap configuration
- **Path Resolution**: Custom alias configuration for cleaner imports
- **Environment Variables**: Vite-based environment configuration for API keys

### Browser APIs
- **File API**: For handling image uploads and file processing
- **Canvas API**: For image manipulation and cropping operations
- **URL API**: For creating object URLs from uploaded files