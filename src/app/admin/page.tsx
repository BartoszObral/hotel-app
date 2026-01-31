'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Reservation {
    id: string
    roomId: string
    startDate: string
    endDate: string
    guestName: string
    guestEmail: string
}

export default function AdminPage() {
    const router = useRouter()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchReservations = async () => {
        try {
            const res = await fetch('/api/reservations')
            if (res.ok) {
                const data = await res.json()
                setReservations(data)
            }
        } catch (error) {
            console.error('Failed to fetch reservations', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return

        try {
            const res = await fetch(`/api/reservations?id=${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                alert('Reservation cancelled')
                fetchReservations() // Refresh list
            } else {
                alert('Failed to cancel reservation')
            }
        } catch (error) {
            console.error('Error deleting reservation', error)
            alert('Error deleting reservation')
        }
    }

    if (isLoading) return <div className="p-8">Loading...</div>

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Guest</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Dates</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-zinc-500">
                                        No active reservations found.
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((res) => (
                                    <tr key={res.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{res.guestName}</td>
                                        <td className="p-4 align-middle">
                                            {new Date(res.startDate).toLocaleDateString()} - {new Date(res.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle">{res.guestEmail}</td>
                                        <td className="p-4 align-middle">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(res.id)}
                                            >
                                                Cancel
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
