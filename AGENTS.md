# AGENTS.md

This file provides AI agents with context and instructions for working with the Virtual Try-On application codebase.

## Project Overview

Virtual Try-On is a React-based AI application that generates photorealistic virtual clothing try-on experiences using Google Gemini AI. The app allows users to upload photos and outfit images to create realistic clothing visualizations.

## Development Environment

### Prerequisites & Setup
- **Runtime**: Node.js v18+ (uses nodejs-20 module in Replit)
- **Package Manager**: npm 
- **Development Server**: Vite on port 5000 (host: 0.0.0.0)
- **API Requirements**: Google Gemini API key in `GEMINI_API_KEY` environment variable

### Quick Start Commands
```bash
npm install                 # Install dependencies
npm run dev                # Start development server (port 5000)
npm run build              # Build for production
npm run preview            # Preview production build
```

### Replit-Specific Configuration
- Development server configured for `host: '0.0.0.0'` and `port: 5000`
- Deployment target: `autoscale` (stateless frontend app)
- Build process: `npm run build` → `npm run preview`

## Project Architecture

### Core Structure
```
├── components/           # React components (TSX files)
│   ├── Header.tsx       # App title and description
│   ├── ImageUploader.tsx # File upload with cropping modal
│   ├── Spinner.tsx      # Loading animation
│   └── [Modal components]
├── services/
│   └── geminiService.ts # Google Gemini AI integration
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── vite.config.ts       # Vite configuration
└── index.html           # HTML template with importmap
```

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS (CDN)
- **AI Service**: Google Gemini 2.5 Flash Image Preview
- **Image Processing**: React Image Crop, HTML5 Canvas
- **Module System**: ES modules with importmap in index.html

### Key Dependencies
```json
{
  "react": "^19.1.0",
  "@google/genai": "^1.10.0", 
  "react-image-crop": "^11.0.6",
  "typescript": "~5.8.2",
  "vite": "^6.2.0"
}
```

## Coding Standards

### File Organization
- **Components**: One component per file in `/components/` directory
- **Services**: API integration logic in `/services/`
- **Types**: TypeScript interfaces defined inline or in component files
- **Styling**: Tailwind CSS classes for all styling

### Code Conventions
- **React**: Functional components with hooks (useState, useCallback, useEffect)
- **TypeScript**: Strict typing, interfaces for props
- **Imports**: ES module imports using importmap configuration
- **Error Handling**: Comprehensive try-catch blocks with user-friendly messages
- **State Management**: Local component state using React hooks

### Component Patterns
- **Props Interface**: Always define TypeScript interface for component props
- **File Upload**: Use FileReader API + object URLs for image handling
- **Loading States**: Progressive loading messages with state management
- **Modal Components**: Portal-style modals with backdrop click handling

## Development Workflow

### Adding New Features
1. Create component files in `/components/` directory
2. Update imports in `App.tsx` or parent components
3. Follow existing patterns for state management and TypeScript interfaces
4. Test with development server: `npm run dev`
5. Verify build process: `npm run build`

### Image Processing Guidelines
- **Supported Formats**: PNG, JPG, JPEG only
- **Processing Pipeline**: Upload → Crop → Resize to 1024x1024 → AI Processing → Crop back to original aspect ratio
- **Canvas Usage**: Use HTML5 Canvas for image manipulation and cropping
- **File Handling**: Create new File objects for processed images

### AI Integration Best Practices
- **API Key**: Access via `process.env.API_KEY` (defined in vite.config.ts)
- **Model**: Use `gemini-2.5-flash-image-preview` for image generation
- **Prompt Engineering**: Maintain detailed prompts with body type fidelity as top priority
- **Error Handling**: Provide fallback messages for API failures

## Testing & Validation

### Before Committing
- Run `npm run dev` and verify app loads without console errors
- Test image upload functionality with various file types
- Verify responsive design on different screen sizes
- Check that build process completes: `npm run build`

### Manual Testing Checklist
- [ ] File upload (drag-drop and click)
- [ ] Image cropping modal functionality
- [ ] Body type selector works
- [ ] Error messages display properly
- [ ] Loading states and animations
- [ ] Image download functionality

## Environment Configuration

### Required Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Vite Configuration Notes
- Environment variables loaded via `loadEnv()`
- API key exposed to client as `process.env.API_KEY`
- Path alias `@` points to project root
- Server configured for Replit proxy compatibility

## Common Issues & Solutions

### Build Issues
- **TypeScript errors**: Check imports and interface definitions
- **Module resolution**: Verify importmap in index.html matches package versions
- **Environment variables**: Ensure GEMINI_API_KEY is set correctly

### Runtime Issues  
- **CORS errors**: Verify Vite server configuration allows all hosts
- **Image upload failures**: Check file type validation and FileReader implementation
- **AI generation failures**: Verify API key and check console for Gemini API errors

### Development Server
- **Port conflicts**: App must run on port 5000 for Replit deployment
- **Hot reload issues**: Restart development server with `npm run dev`
- **Proxy issues**: Ensure `host: '0.0.0.0'` in vite.config.ts

## Security Considerations

- **API Key Exposure**: API key is intentionally exposed to client-side for this demo app
- **File Upload**: Only accepts image files with type validation
- **User Input**: No user-generated content stored, only temporary image processing
- **HTTPS**: Production deployment should use HTTPS for API calls

---

*This file helps AI agents understand the codebase structure and development patterns. Update it when adding new features or changing architecture.*