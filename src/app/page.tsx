import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Luxury Hotel
        </h1>
        <p className="mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
          Experience comfort and elegance in our premium rooms. Book your stay today.
        </p>
        <div className="mt-8">
          <a
            href="/rooms"
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-8 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            View Rooms
          </a>
        </div>
      </main>
    </div>
  );
}
