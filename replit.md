# Overview

Matcha Passport is a mobile-first web application that allows users to discover, check-in to, and collect experiences from matcha cafes. The app functions as a location-based social platform where users can rate cafes, leave comments, save favorite spots for later visits, and build a personal "passport" of their matcha journey. The application features a map-based interface for discovering nearby matcha spots, detailed spot information pages, and user authentication through Google Firebase.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript, utilizing a component-based architecture with modern hooks and context providers. The application uses Wouter for lightweight client-side routing instead of React Router, providing navigation between the map view, spot details, check-in flow, passport, and saved spots. State management is handled through React Context API for authentication and custom hooks for data fetching. The UI is built with Radix UI components styled using Tailwind CSS with a custom matcha-themed color palette.

## Backend Architecture
The server follows a REST API pattern using Express.js with TypeScript. The application is configured for a full-stack monorepo structure where the backend serves both API endpoints and the built frontend assets. The server includes middleware for request logging, JSON parsing, and error handling. The routing system is modular with a dedicated routes file that will contain all API endpoints prefixed with `/api`.

## Data Storage Solutions
The application uses a dual-storage approach. For development and initial setup, it includes an in-memory storage implementation with a simple interface for basic CRUD operations on users. The production setup is configured for PostgreSQL using Drizzle ORM with Neon Database as the serverless PostgreSQL provider. Additionally, Firebase Firestore is integrated for real-time data storage of check-ins, saved spots, and comments, providing offline support and real-time synchronization.

## Authentication and Authorization
Authentication is handled through Firebase Auth using Google OAuth2 provider with redirect-based sign-in flow. The authentication state is managed through a React Context provider that monitors Firebase auth state changes and maintains user session information. The authentication flow is designed to work seamlessly across page refreshes and provides automatic redirect handling for mobile browsers.

## External Dependencies
The application integrates with several external services:

- **Firebase Services**: Authentication via Google OAuth, Firestore for real-time data storage, and hosting configuration
- **Neon Database**: Serverless PostgreSQL database for structured data storage with connection pooling
- **Google Fonts**: Inter font family for consistent typography
- **Radix UI**: Comprehensive component library for accessible UI elements
- **TanStack Query**: Server state management for API caching and synchronization
- **Wouter**: Lightweight routing library for single-page application navigation
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations
- **Vite**: Build tool and development server with React plugin support

The application follows a mobile-first responsive design approach with a maximum width constraint to simulate a mobile app experience on larger screens. The build process uses Vite for development and production builds, with esbuild for server-side bundling.