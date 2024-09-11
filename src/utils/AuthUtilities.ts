import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { Response } from 'express';
const saltRounds = 10;

  class AuthUtilities {
  
    async  getHashedPassword(plainPassword:string):Promise<string> {
    
          const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
          return hashedPassword;
        
      }
      async comparePassword(plainPassword:string,hashedPassword:string):Promise<boolean>{
       
        const isMatch= await bcrypt.compare(plainPassword,hashedPassword)
        return isMatch
      }
      async CreateJwtToken(userId:string,role:string):Promise<{ accessToken: string, refreshToken: string }>{
        const accessToken =jwt.sign({userId,role},process.env.ACCESS_TOKEN_SECRET as string,{expiresIn: '1m'});
        const refreshToken =jwt.sign({userId,role},process.env.REFRESH_TOKEN_SECRET as string,{expiresIn:'30d'});
        return { accessToken, refreshToken };
      }
     
      
 
}

export default new AuthUtilities()

 