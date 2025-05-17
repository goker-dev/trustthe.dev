# Next.js (KODKAFA API) SEO Template

This is a modern [Next.js](https://nextjs.org) project template with TypeScript, shadcn/ui, TailwindCSS, and various development tools pre-configured.

## Features

- ⚡️ Next.js 15 with App Router (React 19)
- 🎨 TailwindCSS 4 with PostCSS
- 🔍 ESLint & Prettier configuration
- 📦 PNPM as package manager
- 🎯 TypeScript support
- 🎭 Radix UI components
- 📊 Analytics integration (Google Analytics & Hotjar)
- 🔄 API integration with OpenAPI
- 🎨 Theme support with next-themes
- 📱 Responsive design
- 🔒 Environment variables configuration

## Prerequisites

- Node.js (Latest LTS version recommended)
- PNPM (Latest version)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Copy the environment variables:
```bash
cp .env-sample .env
```

4. Update the environment variables in `.env` file with your configuration:
- `API_URL`: Your API endpoint
- `API_KEY`: Your API key
- `NEXT_PUBLIC_HOTJAR_ID`: Hotjar tracking ID
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: Google Analytics tracking ID

1. Start the development server:
```bash
pnpm dev
```

The application will be available at [http://localhost:4010](http://localhost:4010)

_PS: Set the PORT number in the package.json if you want._

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm codegen` - Generate API types from OpenAPI specification

## Project Structure

```
src/
├── api/        # API routes and handlers
├── app/        # Next.js app router pages
├── components/ # Reusable React components
├── config/     # Application configuration
├── contexts/   # React contexts
├── hooks/      # Custom React hooks
├── lib/        # Utility functions and libraries
├── services/   # Service layer for API calls
├── styles/     # Global styles and TailwindCSS configuration
└── types/      # TypeScript type definitions
```

## Development Tools

- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit linting
- **TypeScript**: Static type checking
- **TailwindCSS**: Utility-first CSS framework

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

This project is licensed under the MIT License.
