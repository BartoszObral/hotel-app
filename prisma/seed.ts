import { PrismaClient } from '@prisma/client'

// Fallback for local dev if env not loaded
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./dev.db'
}

const prisma = new PrismaClient()

async function main() {
    // Clean up existing data
    await prisma.reservation.deleteMany()
    await prisma.room.deleteMany()

    const rooms = [
        {
            name: 'Apartament Królewski',
            description: 'Luksusowy apartament z widokiem na morze, jacuzzi i prywatnym balkonem.',
            price: 500.0,
            capacity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        },
        {
            name: 'Pokój Rodzinny',
            description: 'Przestronny pokój idealny dla rodzin z dziećmi. Dwa podwójne łóżka.',
            price: 300.0,
            capacity: 4,
            imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        },
        {
            name: 'Pokój Standard',
            description: 'Komfortowy pokój dla dwojga. Wszystkie niezbędne udogodnienia.',
            price: 150.0,
            capacity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        },
        {
            name: 'Studio Deluxe',
            description: 'Nowoczesne studio z aneksem kuchennym i strefą do pracy.',
            price: 250.0,
            capacity: 2,
            imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        },
    ]

    for (const room of rooms) {
        await prisma.room.create({
            data: room,
        })
    }

    console.log('Baza danych została wypełniona przykładowymi pokojami!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
