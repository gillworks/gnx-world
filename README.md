![GNX World Preview](/public/preview.jpg)

# GNX World

AI-powered cover art generator that creates unique album covers with classic vehicles and legendary artists, inspired by Kendrick Lamar's "GNX".

## Features

- **Cover Art Generator**: Create unique album cover art featuring:
  - Classic vehicle imagery
  - Legendary artist/musician integration
  - Customizable vehicle names
  - High-quality image downloads
  - Random combination generator
- **Social Sharing**:
  - Twitter integration with image preview
  - Dedicated share pages for each creation
  - OpenGraph and Twitter Card support
  - Temporary image storage with auto-cleanup
- Modern UI built with Next.js 14 and Tailwind CSS
- Responsive design with shadcn/ui components
- Supabase integration for:
  - Vehicle data management
  - Temporary image storage for social sharing
- Custom fonts with Geist Sans and Geist Mono
- Environment-based configuration

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project with credentials
- OpenAI API key for future AI integration

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
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase Storage:

   - Create a new bucket called 'social-shares'
   - Configure the following storage policies for the bucket:

     ```sql
     -- Enable upload access for all users
     CREATE POLICY "Allow public uploads"
     ON storage.objects FOR INSERT
     WITH CHECK (bucket_id = 'social-shares');

     -- Enable read access for all users
     CREATE POLICY "Allow public read"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'social-shares');

     -- Enable delete access for all users
     CREATE POLICY "Allow public delete"
     ON storage.objects FOR DELETE
     USING (bucket_id = 'social-shares');
     ```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Components

### Cover Art Generator

Located in `components/cover-art-generator.tsx`, this component allows users to:

- Select from a curated list of classic vehicles
- Choose from legendary R&B artists
- Customize vehicle display names
- Generate and download unique cover art
- Share creations directly to Twitter with image previews
- Randomly shuffle vehicle and artist combinations

### Share Page

Located in `app/share/[id]/page.tsx`, this component:

- Provides dedicated pages for shared creations
- Implements OpenGraph and Twitter Card meta tags
- Displays shared images in a responsive layout
- Offers a link to create new artwork
- Handles temporary image storage and cleanup

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Supabase](https://supabase.com/) - Backend, Database, and Storage
- [Geist Fonts](https://vercel.com/font) - Typography
- [Lucide Icons](https://lucide.dev/) - Icon System

## Project Structure

```
gnx-world/
├── app/              # Next.js app directory and layouts
│   └── share/       # Social sharing pages
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── *.tsx        # Custom components
├── lib/             # Utility functions
├── public/          # Static assets
└── styles/          # Global styles and Tailwind config
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
