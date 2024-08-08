import  Teacher  from "../models/Teacher";
import { CustomError,CustomErrorClass } from '../types/CustomError';
import {ITeacher} from '../models/Teacher'


class teacherRepository {
  async home(data:ITeacher) {
    return data
  }
}

export default new teacherRepository();
