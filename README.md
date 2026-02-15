# CodeMentor AI

An intelligent pair programming assistant that provides real-time code review, explanations, and suggestions using Claude AI.

## Features

- **Real-time Code Analysis**: Get instant feedback as you type
- **Multi-language Support**: JavaScript, TypeScript, Python, Java, C++, Rust, Go
- **Ask AI**: Ask specific questions about your code
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Streaming Responses**: See AI analysis in real-time with streaming
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Monaco Editor** - VS Code's editor component
- **Claude AI (Anthropic)** - Via Vercel AI SDK
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Bun** - Fast JavaScript runtime

## Getting Started

### Prerequisites

- Bun installed
- Anthropic API key (set as `ANTHROPIC_API_KEY` environment variable)

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
bun run build
```

### Start Production Server

```bash
bun start
```

## How It Works

1. Write or paste code in the Monaco editor
2. After 2 seconds of inactivity, CodeMentor AI automatically analyzes your code
3. Get instant feedback on:
   - What the code does
   - Potential bugs or issues
   - Performance optimizations
   - Best practices
   - Security considerations
4. Ask specific questions using the "Ask AI" feature
5. Copy analysis results with one click

## Environment Variables

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## TreeHacks 2026

Built for TreeHacks 2026, Stanford's flagship hackathon.

## License

MIT
