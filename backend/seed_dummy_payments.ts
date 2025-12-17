
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Dummy Payment Data for AI Forecasting...');

    try {
        // 1. Get or Create Nurse
        let nurse = await prisma.user.findFirst({ where: { role: 'PERAWAT' } });
        if (!nurse) {
            nurse = await prisma.user.create({
                data: {
                    username: 'nurse_dummy',
                    email: 'nurse_dummy@poladc.com',
                    passwordHash: 'dummy',
                    role: 'PERAWAT',
                    fullName: 'Nurse Dummy',
                    phone: "08123456789"
                }
            });
            console.log('✅ Created dummy nurse');
        }

        // 2. Get or Create Patient
        let patient = await prisma.patient.findFirst();
        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    fullName: 'Pasien Dummy 1',
                    gender: 'L',
                    dateOfBirth: new Date('1990-01-01'),
                    phone: '08123456789',
                    patientNumber: 'P-DUMMY-001',
                    address: 'Jl. Dummy No. 1'
                }
            });
            console.log('✅ Created dummy patient');
        }

        // 3. Clear existing dummy payments if any (optional, but good for cleanliness)
        // Skipped to avoid deleting real data

        // 4. Generate Data for last 12 weeks
        const today = new Date();

        for (let i = 0; i < 60; i++) { // Generate 60 transactions
            // Random date within last 12 weeks
            const daysAgo = Math.floor(Math.random() * 80);
            const txDate = new Date();
            txDate.setDate(today.getDate() - daysAgo);

            // Random Amount (500k - 2.5jt)
            const amount = Math.floor(Math.random() * (2500000 - 500000 + 1) + 500000);

            // Create Visit
            const visit = await prisma.visit.create({
                data: {
                    visitDate: txDate,
                    status: 'COMPLETED',
                    patientId: patient.id,
                    nurseId: nurse.id,
                    queueNumber: i + 1,
                    visitNumber: `V-DUMMY-${Math.random().toString(36).substring(7)}`,
                    totalCost: amount
                }
            });

            // Create Payment
            await prisma.payment.create({
                data: {
                    visitId: visit.id,
                    paymentDate: txDate,
                    amount: amount,
                    paidAmount: amount,
                    paymentMethod: 'CASH',
                    status: 'PAID',
                    paymentNumber: `PAY-${Math.random().toString(36).substring(7)}`
                }
            });
        }

        console.log('✅ Successfully seeded 60 dummy transactions across last ~12 weeks.');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
