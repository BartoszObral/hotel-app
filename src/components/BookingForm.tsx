'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Room } from '@prisma/client'
import { Button } from '@/components/ui/button'

interface BookingFormProps {
    room: Room
}

interface Reservation {
    startDate: string
    endDate: string
}

export function BookingForm({ room }: BookingFormProps) {
    const router = useRouter()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reservations, setReservations] = useState<Reservation[]>([])

    useEffect(() => {
        // Fetch existing reservations for this room
        const fetchReservations = async () => {
            try {
                const res = await fetch(`/api/reservations?roomId=${room.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setReservations(data)
                }
            } catch (err) {
                console.error('Failed to load reservations')
            }
        }
        fetchReservations()
    }, [room.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: room.id,
                    startDate,
                    endDate,
                    guestName,
                    guestEmail,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to create reservation')
            }

            alert('Reservation created successfully!')
            router.refresh()
            setStartDate('')
            setEndDate('')
            setGuestName('')
            setGuestEmail('')

            // Refresh reservations
            const refreshRes = await fetch(`/api/reservations?roomId=${room.id}`)
            if (refreshRes.ok) {
                const data = await refreshRes.json()
                setReservations(data)
            }

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6 dark:bg-zinc-900 dark:border-zinc-800">
                <h3 className="font-semibold leading-none tracking-tight mb-4 text-xl">
                    Book This Room
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md dark:bg-red-950/20">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Start Date</label>
                            <input
                                type="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">End Date</label>
                            <input
                                type="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Guest Name</label>
                        <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="John Doe"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email</label>
                        <input
                            type="email"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="john@example.com"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Booking...' : 'Confirm Reservation'}
                    </Button>
                </form>
            </div>

            {/* Availability List */}
            <div className="rounded-xl border bg-zinc-50 p-6 dark:bg-zinc-800/50 dark:border-zinc-800">
                <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-zinc-500">
                    Occupied Dates
                </h4>
                {reservations.length === 0 ? (
                    <p className="text-sm text-zinc-500 italic">This room is fully available.</p>
                ) : (
                    <ul className="space-y-2">
                        {reservations.map((res, i) => (
                            <li key={i} className="text-sm flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                {new Date(res.startDate).toLocaleDateString()}
                                <span className="text-zinc-400">to</span>
                                {new Date(res.endDate).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

