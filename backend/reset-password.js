
const { PrismaClient } = require('./generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword(email, newPassword) {
    console.log(`🔒 Resetting password for: ${email}`);

    try {
        // 1. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 2. Update the user in the database
        const user = await prisma.user.update({
            where: { email: email },
            data: { passwordHash: hashedPassword },
        });

        console.log(`✅ Password for ${user.username} (${user.email}) has been changed to: ${newPassword}`);
    } catch (error) {
        if (error.code === 'P2025') {
            console.error(`❌ User with email ${email} not found.`);
        } else {
            console.error('❌ Error updating password:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

// Ganti email di sini sesuai yang ada di screenshot
// Saya pilih 'itsmeentn@gmail.com' (dokter002) karena role-nya DOKTER
const TARGET_EMAIL = 'itsmeentn@gmail.com';
const NEW_PASSWORD = 'password123';

resetPassword(TARGET_EMAIL, NEW_PASSWORD);
