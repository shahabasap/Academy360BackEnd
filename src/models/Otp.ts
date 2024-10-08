import mongoose, { Document, Schema } from 'mongoose';
import {Iotp} from '../types/CommonTypes'



const OtpSchema = new Schema<Iotp>({
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    expiresAt: { type: Date, required: true }
});

// Create a TTL index on the expiresAt field
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 }); // 300 seconds = 5 minutes

export default mongoose.model<Iotp>('Otp', OtpSchema);
