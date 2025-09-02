# Virtual Try-On App

## Overview

Virtual Try-On is a React-based AI application that allows users to upload their photo and an outfit image to generate photorealistic try-on visualizations. The app uses OpenRouter to access Google's Gemini 2.5 Flash Image Preview model, creating realistic clothing overlays on user photos, supporting different body types and providing an interactive virtual dressing room experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS for responsive design and modern UI components
- **Build Tool**: Vite for fast development and optimized production builds
- **State Management**: React hooks (useState, useCallback, useEffect) for local component state
- **Image Processing**: React Image Crop library for user photo cropping functionality

### Component Structure
- **App.tsx**: Main application component managing global state and orchestrating the try-on workflow
- **Header.tsx**: Application title and description display
- **ImageUploader.tsx**: Handles file uploads with drag-and-drop functionality and image cropping
- **ProductSelector.tsx**: Scrollable gallery for outfit selection
- **Spinner.tsx**: Loading indicator during AI processing
- **Modal Components**: AddProductModal and DebugModal for enhanced user interactions

### AI Integration
- **Service Layer**: Dedicated geminiService.ts for AI model integration via OpenRouter
- **Primary Method**: OpenRouter API as the main pathway to Google's Gemini 2.5 Flash Image Preview model
- **Image Processing Pipeline**: 
  - Automatic image dimension detection and aspect ratio preservation
  - Square padding for consistent AI input format
  - Post-processing to crop results back to original aspect ratios
- **Body Type Support**: Configurable body build options (Slim, Athletic, Average, Curvy, Plus Size)
- **Progressive Loading**: Multi-stage loading messages to enhance user experience

### Data Flow
- **File Handling**: Browser File API for image uploads and processing
- **Image Rendering**: Object URLs for efficient client-side image display
- **Error Handling**: Comprehensive error states with user-friendly messaging
- **Loading States**: Progressive feedback system with contextual loading messages

## External Dependencies

### Core Libraries
- **React & React DOM**: Frontend framework and rendering (v19.1.0)
- **TypeScript**: Type safety and enhanced developer experience (v5.8.2)
- **Vite**: Development server and build tooling (v6.2.0)

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