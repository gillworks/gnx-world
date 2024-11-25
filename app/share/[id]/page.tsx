import { createClient } from "@supabase/supabase-js";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const filename = params.id;

  const {
    data: { publicUrl },
  } = supabase.storage.from("social-shares").getPublicUrl(filename);

  return {
    title: "GNX World Creation",
    description: "Check out my GNX World creation!",
    openGraph: {
      images: [publicUrl],
    },
    twitter: {
      card: "summary_large_image",
      images: [publicUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const filename = params.id;

  const {
    data: { publicUrl },
  } = supabase.storage.from("social-shares").getPublicUrl(filename);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-zinc-900">
        <div className="aspect-square relative">
          <Image
            src={publicUrl}
            alt="GNX World Creation"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            GNX World Creation
          </h1>
          <p className="text-zinc-400">
            Created with GNX World - Inspired by Kendrick Lamar.
          </p>
        </div>
      </div>
      <a
        href="/"
        className="mt-6 text-zinc-500 hover:text-white transition-colors"
      >
        Create your own →
      </a>
    </div>
  );
}
