# robots.txt Tester

A web tool for validating URLs against robots.txt rules. Built with RFC 9309 compliant parsing.

## Features

- Validate multiple URLs against robots.txt content
- Support for common user agent presets
- Table and tree view for results
- Export results to CSV
- Local storage persistence

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19 with React Compiler
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **UI**: Base UI
- **Parser**: @trybyte/robotstxt-parser

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Type-check and build for production |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |
| `bun run fix` | Type-check + lint + format |
| `bun run preview` | Preview production build |
