
import { PrismaClient, UserRole } from '../../generated/prisma';
import { hash } from 'bcryptjs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
    const password = await hash('password123', 10);

    try {
        const user = await prisma.user.upsert({
            where: { username: 'dokter1' },
            update: {},
            create: {
                username: 'dokter1',
                email: 'dokter1@roxydental.com',
                passwordHash: password,
                fullName: 'Dr. Roxy',
                role: UserRole.DOKTER,
                phone: '08123456789',
                specialization: 'Gigi Umum',
            },
        });
        console.log('✅ Akun Dokter berhasil dibuat/ditemukan:');
        console.log('Username: dokter1');
        console.log('Password: password123');
    } catch (e) {
        console.error('Error creating doctor:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
