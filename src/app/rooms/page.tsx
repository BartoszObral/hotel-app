import { prisma } from '@/lib/prisma'
import { RoomCard } from '@/components/RoomCard'
import { Room } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default async function RoomsPage() {
    const rooms = await prisma.room.findMany()

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="mb-8 text-4xl font-bold tracking-tight">Our Rooms</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room: Room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
            {rooms.length === 0 && (
                <div className="text-center py-20 text-zinc-500">
                    No rooms found. Please seed the database.
                </div>
            )}
        </div>
    )
}
