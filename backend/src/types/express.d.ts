import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username?: string;
        fullName?: string;
        phoneNumber?: string;
        role?: string;
      };
    }
  }
}

export {};