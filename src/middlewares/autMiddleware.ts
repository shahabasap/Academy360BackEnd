import jwt from 'jsonwebtoken';
import { Response, NextFunction,Request } from 'express';
import Student, { IStudent } from '../models/Student';
import Teacher, { ITeacher } from '../models/Teacher';
import { CustomJwtPayload } from '../types/CustomRequest';
import Admin,{IAdmin} from '../models/admin';

class AuthMiddleware {
  authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies['JwtStudent'];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
        const data = await Student.findById(decoded.userdata).select('-password');
        req.user = data as IStudent;
        if(req.user)
          {
            next();
          }
          else
           {
            res.status(401).json({ message: 'Not authorized, no token' });
           }
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };

  TeacherAuthenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  
    const token = req.cookies['JwtTeacher'];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;
        const data = await Teacher.findById(decoded.userdata).select('-password');
        req.user = data as ITeacher;
         if(req.user)
         {
          next();
         }
         else
         {
          res.status(401).json({ message: 'Not authorized, no token' });
         }
        
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
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
          res.status(401).json({ message: 'Not authorized, no token' });
         }
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };
}

export default new AuthMiddleware();
