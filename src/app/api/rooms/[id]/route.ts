import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params
        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                reservations: true,
            },
        })

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 })
        }

        return NextResponse.json(room)
    } catch (error) {
        console.error('Error fetching room:', error)
        return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 })
    }
}
