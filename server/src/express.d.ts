import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      admin?: any; // or more specific type if you prefer
    }
  }
}
