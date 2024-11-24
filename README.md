# GNX World

A Next.js-based web application featuring an AI-powered cover art generator and other creative tools.

## Features

- **Cover Art Generator**: Create unique album cover art using AI technology
- Modern UI built with Next.js 14 and Tailwind CSS
- Responsive design with shadcn/ui components
- Environment-based configuration

## Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key for the cover art generator

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
   Create a `.env` file in the root directory with:

```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Components

### Cover Art Generator

Located in `components/cover-art-generator.tsx`, this component allows users to:

- Generate unique album cover art using AI
- Customize generation parameters
- Download generated images

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- OpenAI API - AI Image Generation

## Project Structure

```
gnx-world/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions
├── public/          # Static assets
└── styles/          # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
