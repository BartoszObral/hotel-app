import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    try {
        const whereClause = roomId ? { roomId } : {}
        const reservations = await prisma.reservation.findMany({
            where: whereClause,
            orderBy: { startDate: 'asc' },
        })
        return NextResponse.json(reservations)
    } catch (error) {
        console.error('Error fetching reservations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reservations' },
            { status: 500 }
        )
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { startDate, endDate, guestName, guestEmail, roomId } = body

        // Validation
        if (!startDate || !endDate || !guestName || !guestEmail || !roomId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const start = new Date(startDate)
        const end = new Date(endDate)

        if (start >= end) {
            return NextResponse.json(
                { error: 'End date must be after start date' },
                { status: 400 }
            )
        }

        // Check for conflicts
        const conflict = await prisma.reservation.findFirst({
            where: {
                roomId,
                OR: [
                    {
                        startDate: { lt: end },
                        endDate: { gt: start },
                    },
                ],
            },
        })

        if (conflict) {
            return NextResponse.json(
                { error: 'Selected dates are already booked' },
                { status: 409 }
            )
        }

        // Create reservation
        const reservation = await prisma.reservation.create({
            data: {
                startDate: start,
                endDate: end,
                guestName,
                guestEmail,
                roomId,
            },
        })

        return NextResponse.json(reservation)
    } catch (error) {
        console.error('Error creating reservation:', error)
        return NextResponse.json(
            { error: 'Failed to create reservation' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    try {
        await prisma.reservation.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting reservation:', error)
        return NextResponse.json(
            { error: 'Failed to delete reservation' },
            { status: 500 }
        )
    }
}
