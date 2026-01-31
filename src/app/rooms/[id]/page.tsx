import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookingForm } from '@/components/BookingForm'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function RoomDetailsPage({
    params,
}: {
    params: any
}) {
    const { id } = await params

    const room = await prisma.room.findUnique({
        where: { id },
    })

    if (!room) {
        notFound()
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <Button variant="ghost" asChild className="pl-0 hover:bg-transparent">
                    <Link href="/rooms" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white">
                        ← Back to Rooms
                    </Link>
                </Button>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={room.imageUrl}
                            alt={room.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{room.name}</h1>
                        <div className="mt-2 text-xl font-medium text-zinc-900 dark:text-zinc-100">
                            ${room.price} <span className="text-sm text-zinc-500 font-normal">/ night</span>
                        </div>
                        <p className="mt-4 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                            {room.description}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                Capacity: {room.capacity} Guests
                            </span>
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                Free Wi-Fi
                            </span>
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                Ocean View
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <BookingForm room={room} />
                </div>
            </div>
        </div>
    )
}
