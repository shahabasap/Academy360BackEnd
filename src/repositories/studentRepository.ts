import Student from "../models/Student";
import { CustomError,CustomErrorClass } from '../types/CustomError';
import {IStudent} from '../models/Student'




class StudentRepository {
  async home(data:IStudent) {
  
    return data;
  }
}

export default new StudentRepository();
