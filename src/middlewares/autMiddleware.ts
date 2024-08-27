import jwt from 'jsonwebtoken';
import { Response, NextFunction,Request } from 'express';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import {ITeacher} from '../types/CommonTypes'
import { CustomJwtPayload } from '../types/CustomRequest';
import Admin from '../models/admin';
import IAdmin from '../types/CommonTypes'
import IStudent from '../types/CommonTypes'
import blockChecking from './blockChecking';

class AuthMiddleware {
  authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies['JwtStudent'];
   
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
        const data = await Student.findById(decoded.userdata).select('-password');
        if(data)
          {
            const student=await blockChecking.StudentIsBlocked(data._id as string)
            if(!student.valid)
            {
               res.status(400).json({ message: 'User is already blocked',valid:false });
               return
            }
          }
        req.user = data as IStudent;
        if(req.user)
          {
         
            next();
          }
          else
           {
            res.status(401).json({ message: 'Not authorized, no token',token:false,valid:true});
           }
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token',token:false,valid:true  });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token',token:false ,valid:true });
    }
  };

  TeacherAuthenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
    const token = req.cookies['JwtTeacher'];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
        const data = await Teacher.findById(decoded.userdata).select('-password');
        if(data)
        {
          const student=await blockChecking.TeacherIsBlocked(data._id as string)

          if(!student.valid)
          {
             res.status(400).json({ error: 'User is already blocked',valid:false });
             return
          }
        }
       

        req.user = data as ITeacher;
 
        
         if(req.user)
         {
          
          next();
         }
         else
         {
          res.status(401).json({ message: 'Not authorized, no token',token:false,valid:true});
         }
        
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token',token:false,valid:true });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token',token:false,valid:true });
    }
  };

  AdminAuthenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies['JwtAdmin'];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
        const data = await Admin.findById(decoded.userdata).select('-password');
        req.user = data as IAdmin;
        if(req.user)
        {
          next();
        }
        else
         {
          res.status(401).json({ message: 'Not authorized, no token',token:true  });
         }
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token',token:true  });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token',token:true  });
    }
  };
}

export default new AuthMiddleware();
