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
      async CreateJwtToken(res:Response,userdata:mongoose.Schema.Types.ObjectId | string,TokenName:string):Promise<void>{
        const token=jwt.sign({userdata},process.env.JWT_SECRET as string,{expiresIn:'30d'});
        res.cookie(TokenName,token,{
            httpOnly:true,
            secure:process.env.NODE_ENV != 'development',
            sameSite:'strict',
            maxAge:30*24*60*60*1000
        })
      }
      

}

export default new AuthUtilities()

 