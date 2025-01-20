import { PrismaClient } from "@prisma/client";
import { Prisma } from '@prisma/client';

const db = new PrismaClient();

export async function getNearbyMechanics(req, res) {
    try {
        const { latitude, longitude, radiusInKm = 10 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ 
                message: "Latitude and longitude are required." 
            });
        }

        // Convert strings to numbers and cast for Prisma raw query
        const lat = new Prisma.Decimal(latitude);
        const lng = new Prisma.Decimal(longitude);
        const radius = new Prisma.Decimal(radiusInKm);

        const mechanics = await db.$queryRaw`
            SELECT 
                *,
                ( 6371 * acos(
                    cos(radians(${lat}::float)) * 
                    cos(radians(latitude::float)) * 
                    cos(radians(longitude::float) - radians(${lng}::float)) + 
                    sin(radians(${lat}::float)) * 
                    sin(radians(latitude::float))
                ))::float AS distance
            FROM "mechanic"
            WHERE ( 6371 * acos(
                    cos(radians(${lat}::float)) * 
                    cos(radians(latitude::float)) * 
                    cos(radians(longitude::float) - radians(${lng}::float)) + 
                    sin(radians(${lat}::float)) * 
                    sin(radians(latitude::float))
                ))::float <= ${radius}::float
            ORDER BY distance
            LIMIT 50
        `;

        return res.status(200).json(mechanics);
    } catch (error) {
        let errorMessage = "Internal Server Error";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("Error:", errorMessage);
        if (!res.headersSent) {
            return res.status(500).json({
                message: errorMessage,
                details: error instanceof Error ? error.message : error,
            });
        }
    }
}