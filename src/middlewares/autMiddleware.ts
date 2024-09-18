import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Admin from '../models/admin';
import { IStudent, ITeacher } from '../types/CommonTypes';
import blockChecking from './blockChecking';

interface CustomJwtPayload {
  userId: string;
  role: string;
}

class AuthMiddleware {
  private ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
  private REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

  authenticateToken = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      const accessToken = req.cookies[`access-token-${role}`];
      const refreshToken = req.cookies[`refresh-token-${role}`];
    
      

      try {
        // Verify access token
        const decodedAccessToken = jwt.verify(accessToken, this.ACCESS_TOKEN_SECRET) as CustomJwtPayload;

        // Ensure the role matches
        if (decodedAccessToken.role !== role) {
          return res.status(403).json({ message: 'Forbidden: Role mismatch' });
        }

        // Check role and authenticate accordingly
        switch (decodedAccessToken.role) {
          case 'student':
            await this.authenticateStudent(req, res, next, decodedAccessToken.userId);
            break;
          case 'teacher':
            await this.authenticateTeacher(req, res, next, decodedAccessToken.userId);
            break;
          case 'admin':
            await this.authenticateAdmin(req, res, next, decodedAccessToken.userId);
            break;
          default:
            return res.status(401).json({ message: 'Invalid role', token: false ,role:role});
        }

      } catch (error) {

        // Handle token expiration or invalid token
        if (refreshToken) {
          const decodedRefreshToken = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as CustomJwtPayload;

          try {
            const newAccessToken = jwt.sign(
              { userId: decodedRefreshToken.userId, role: decodedRefreshToken.role },
              this.ACCESS_TOKEN_SECRET,
              { expiresIn: '15m' }
            );

            // Set new access token in the cookie
            res.cookie(`access-token-${role}`, newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 15 * 60 * 1000, // 15 minutes
            });

            // Retry authentication with the new token
            req.cookies[`access-token-${role}`] = newAccessToken;
            await this.authenticateToken(role)(req, res, next);
          } catch (refreshError) {
            return res.status(401).json({ message: 'Invalid refresh token', token: false,role:role });
          }

        } else {
          return res.status(401).json({ message: 'Not authorized, invalid or expired token', token: false,role:role });
        }
      }
    };
  };

  private async authenticateStudent(req: Request, res: Response, next: NextFunction, userId: string): Promise<any> {
    const student = await Student.findById(userId).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found', valid: false,role:"student" });
    }
    const blockStatus = await blockChecking.StudentIsBlocked(userId);
    if (!blockStatus.valid) {
      return res.status(400).json({ message: 'User is blocked', valid: false ,role:"student"});
    }
    req.user = student;
    next();
  }

  private async authenticateTeacher(req: Request, res: Response, next: NextFunction, userId: string): Promise<any> {
    const teacher = await Teacher.findById(userId).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found', valid: false ,role:"teacher"});
    }
    const blockStatus = await blockChecking.TeacherIsBlocked(userId);
    if (!blockStatus.valid) {
      return res.status(400).json({ message: 'User is blocked', valid: false ,role:"teacher"});
    }
    req.user = teacher;
    next();
  }

  private async authenticateAdmin(req: Request, res: Response, next: NextFunction, userId: string): Promise<any> {
    const admin = await Admin.findById(userId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found', valid: false,role:"admin" });
    }
    req.user = admin;
    next();
  }
}

export default new AuthMiddleware();
