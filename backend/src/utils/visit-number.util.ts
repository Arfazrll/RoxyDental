import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateVisitNumber(): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `RM-${year}${month}${day}`;
  
  const lastVisit = await prisma.visit.findFirst({
    where: {
      visitNumber: {
        startsWith: prefix
      }
    },
    orderBy: {
      visitNumber: 'desc'
    }
  });

  let sequence = 1;
  if (lastVisit && lastVisit.visitNumber) {
    const lastSequence = parseInt(lastVisit.visitNumber.split('-').pop() || '0');
    sequence = lastSequence + 1;
  }

  const visitNumber = `${prefix}-${String(sequence).padStart(4, '0')}`;
  return visitNumber;
}