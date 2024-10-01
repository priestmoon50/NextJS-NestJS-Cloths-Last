// src/auth/jwt-payload.interface.ts
import { Types } from 'mongoose';

export interface JwtPayload {
  userId: string | Types.ObjectId;  // پذیرش هر دو نوع string و ObjectId
  email: string;
  username: string; 
}
