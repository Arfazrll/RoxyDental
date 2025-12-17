
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('⏳ Connecting to database...');
    try {
        // Attempt to query the database
        const userCount = await prisma.user.count();
        console.log(`✅ SUCCESS! Connected to Supabase.`);
        console.log(`📊 Number of users in database: ${userCount}`);
    } catch (error) {
        console.error('❌ ERROR: Could not connect to database.');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
