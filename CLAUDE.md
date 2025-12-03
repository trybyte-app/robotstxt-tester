# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
bun run dev       # Start development server (Vite)
bun run build     # Type-check and build for production
bun run lint      # Run ESLint
bun run format    # Format code with Prettier
bun run fix       # Type-check + lint + format
bun run preview   # Preview production build
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19 with React Compiler enabled
- **Bundler**: Vite (rolldown-vite fork)
- **Styling**: Tailwind CSS v4
- **UI Components**: Base UI (@base-ui-components/react)
- **Validation**: Zod v4
- **Core Library**: @trybyte/robotstxt-parser (RFC 9309 compliant)

## Architecture

This is a robots.txt testing tool that validates URLs against robots.txt rules.

### Core Flow
1. User inputs robots.txt content and URL list
2. `useRobotsTester` hook orchestrates state and testing logic
3. URLs are validated via `validateUrls()` (Zod schema)
4. Valid URLs are checked against robots.txt using `ParsedRobots.parse().checkUrls()`
5. Results display in table or tree view

### Key Patterns
- **State Management**: `useRobotsTester` hook manages all app state; persisted fields use `useLocalStorage`
- **Path Alias**: `@/*` maps to `./src/*`
- **Results Tree**: `buildUrlTree()` creates hierarchical view from flat URL results
- **Types**: Core types in `src/types/robots.ts` (`ProcessedUrlResult`, `UrlTreeNode`, `ResultsSummary`)

### Directory Structure
- `src/components/robots-tester/` - Main feature components
- `src/hooks/` - Custom hooks including core `use-robots-tester.ts`
- `src/lib/` - Utilities (tree-builder, url-validation, csv-export, storage)
- `src/constants/` - User agent presets and storage keys
- `src/components/ui/` - Base UI component wrappers
