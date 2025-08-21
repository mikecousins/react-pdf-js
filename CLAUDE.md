# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for `@mikecousins/react-pdf`, a React component library that provides an easy way to render PDF documents using PDF.js. The repository uses pnpm workspaces with Turborepo for build orchestration.

## Repository Structure

- `packages/react-pdf-js/` - Main React PDF component library
- `apps/demo/` - Demo application showcasing the component
- `apps/demo-react-router/` - React Router demo application  
- `apps/docs/` - Documentation site built with Next.js

## Development Commands

### Root Level Commands (use these for most tasks)
- `pnpm build` - Build all packages and apps via Turborepo
- `pnpm lint` - Lint all packages and apps via Turborepo
- `pnpm test` - Run tests for all packages via Turborepo
- `pnpm format` - Format all code using Prettier

### Package-Specific Commands
For the main library (`packages/react-pdf-js/`):
- `pnpm build` - Build using tsup (outputs ESM and CJS formats)
- `pnpm lint` - Run ESLint

### Package Manager
This project uses `pnpm` as the package manager (version 10.7.0). Always use `pnpm` instead of npm or yarn.

## Core Architecture

The main library exports a single React hook called `usePdf` that:

1. **PDF Document Loading**: Uses PDF.js `getDocument()` to load PDF files from URLs
2. **Canvas Rendering**: Renders PDF pages to HTML5 canvas elements with support for:
   - Scaling and rotation
   - High DPI displays (devicePixelRatio handling)
   - Render task cancellation for performance
3. **Lifecycle Callbacks**: Provides optional callbacks for document/page load and render events
4. **Configuration**: Supports PDF.js worker configuration, cMap settings, and credential handling

### Key Files
- `packages/react-pdf-js/src/index.tsx` - Main hook implementation and TypeScript types
- `packages/react-pdf-js/package.json` - Library configuration with peer dependencies on React 19+ and pdfjs-dist 5+

## Testing

Tests are located in `packages/react-pdf-js/test/` and use Jest with React Testing Library. The project includes canvas mocking for PDF rendering tests.

## Build Output

The library builds to both ESM and CommonJS formats in the `dist/` directory with full TypeScript declarations.