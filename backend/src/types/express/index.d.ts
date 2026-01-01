import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        email: string;
        fullName: string;
        role: UserRole;
      };
    }
  }
}