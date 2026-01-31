import Link from 'next/link'
import { Room } from '@prisma/client'
import { Button } from '@/components/ui/button'

interface RoomCardProps {
    room: Room
}

export function RoomCard({ room }: RoomCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-950 dark:border-zinc-800">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-2 dark:text-zinc-400">
                    {room.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">${room.price} / night</span>
                    <Button asChild size="sm">
                        <Link href={`/rooms/${room.id}`}>
                            View Details
                        </Link>
                    </Button>
                </div>
                <div className="mt-2 text-xs text-zinc-400">
                    Max capacity: {room.capacity} guests
                </div>
            </div>
        </div>
    )
}
