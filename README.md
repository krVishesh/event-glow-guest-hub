# Event Glow Guest Hub

A modern web application built with React, TypeScript, and shadcn/ui for managing event guests and RSVPs. This project is a frontend upgrade of the existing [Guest Care](https://github.com/krVishesh/GC-maybe) project, providing a more modern and user-friendly interface.

## Project Overview

This project is a guest management system that allows event organizers to:
- Manage guest lists
- Manage dorms lists
- Track Updates
- Monitor guest attendance

## Backend Development Needed

This frontend upgrade requires a corresponding backend implementation. We're looking for contributors to help develop the backend API that will support these features:

- User authentication and authorization
- Guest data management
- Dorm management
- Email notification system
- Analytics and reporting
- and more of what you can think of

If you're interested in contributing to the backend development, please check out the repo, fork it, develop it and get in touch!

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Query
- **Routing**: React Router
- **UI Components**: Radix UI primitives
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event-glow-guest-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utility functions and configurations
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── styles/        # Global styles
└── App.tsx        # Main application component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
