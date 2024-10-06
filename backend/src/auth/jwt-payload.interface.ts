import { Types } from 'mongoose';

export interface JwtPayload {
  userId: string | Types.ObjectId;  // پذیرش هر دو نوع string و ObjectId
  phone: string;
  username: string; 
}