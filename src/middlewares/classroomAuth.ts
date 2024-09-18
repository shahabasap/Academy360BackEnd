import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import Classroom from '../models/Classroom';

// Define the CustomJwtPayload interface
interface CustomJwtPayload extends jwt.JwtPayload {
  userId: string;
  role: string;
}

// Extend the Express Request interface to include custom properties
declare global {
  namespace Express {
    interface Request {
      classroom?: any; // Replace 'any' with a more specific type if available
      
    }
  }
}

class ClassroomAuth {
  private ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
  private REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

  // Authentication middleware for roles
  authenticateToken = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const accessToken = req.cookies[`access-token-${role}`];
      const refreshToken = req.cookies[`refresh-token-${role}`];

      if (!accessToken) {
        res.status(401).json({ message: 'Access token not found', tokenClass:false,role:role });
        return;
      }

      try {
        // Verify access token
        const decodedAccessToken = jwt.verify(accessToken, this.ACCESS_TOKEN_SECRET) as CustomJwtPayload;

        // Ensure the role matches
        if (decodedAccessToken.role !== role) {
          res.status(403).json({ message: 'Forbidden: Role mismatch' });
          return;
        }

        // Authenticate based on role
        if (role === 'student-class') {
          await this.authenticateStudentClass(req, res, next, decodedAccessToken.userId);
        } else if (role === 'teacher-class') {
          await this.authenticateTeacherClass(req, res, next, decodedAccessToken.userId);
        } else {
          res.status(401).json({ message: 'Invalid role', tokenClass: false,role:role});
          return;
        }

      } catch (error) {
        // Handle expired or invalid access token
        if (error instanceof jwt.TokenExpiredError) {
          // Token expired, try to refresh
          await this.handleTokenRefresh(req, res, next, role, refreshToken);
        } else {
          res.status(401).json({ message: 'Invalid access token', tokenClass: false,role:role });
        }
      }
    };
  };

  // Handle token refresh if the access token is expired
  private handleTokenRefresh = async (req: Request, res: Response, next: NextFunction, role: string, refreshToken: string | undefined): Promise<void> => {
    if (!refreshToken) {
      res.status(403).json({ message: 'Refresh token not found', tokenClass: false,role:role });
      return;
    }

    try {
      // Verify refresh token
      const decodedRefreshToken = jwt.verify(refreshToken, this.REFRESH_TOKEN_SECRET) as CustomJwtPayload;

      // Generate new access token
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

      // Retry authentication with new token
      req.cookies[`access-token-${role}`] = newAccessToken;
      await this.authenticateToken(role)(req, res, next);

    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token', tokenClass: false,role:role });
    }
  };

  // Authenticate the student class based on userId
  private async authenticateStudentClass(req: Request, res: Response, next: NextFunction, userId: string): Promise<void> {
    try {
      const studentClassroom = await Classroom.findById(userId);
      if (!studentClassroom) {
        res.status(404).json({ message: 'Student not found', valid: false,role:"student-class"});
        return;
      }

      // Check if the student is blocked
      const blockStatus = await Classroom.findOne({ _id: userId, Is_blocked: false });
      if (!blockStatus) {
        res.status(403).json({ message: 'Student is blocked', valid: false,role:"student-class" });
        return;
      }

      // Pass the classroom data forward
      req.classroom = studentClassroom;
      next();

    } catch (error) {
      res.status(500).json({ message: 'Error authenticating student class', error: (error as Error).message,tokenClass:false,role:"studen-class"});
    }
  }

  // Authenticate the teacher class based on userId
  private async authenticateTeacherClass(req: Request, res: Response, next: NextFunction, userId: string): Promise<void> {
    try {
      const teacherClassroom = await Classroom.findById(userId);
      if (!teacherClassroom) {
        res.status(404).json({ message: 'Teacher not found', valid: false });
        return;
      }

      // Check if the teacher is blocked
      const blockStatus = await Classroom.findOne({ _id: userId, Is_blocked: false });
      if (!blockStatus) {
        res.status(403).json({ message: 'Teacher is blocked', valid: false ,role:"teacher-class"});
        return;
      }

      // Pass the classroom data forward
      req.classroom = teacherClassroom;
      next();

    } catch (error) {
      res.status(500).json({ message: 'Error authenticating teacher class', error: (error as Error).message,valid: false,role:"teacher-class" });
    }
  }
}

export default new ClassroomAuth();