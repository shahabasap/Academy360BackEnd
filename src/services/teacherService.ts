import teacerRepository from "../repositories/teacerRepository";
import { CustomErrorClass } from "../types/CustomError";
import {ITeacher} from '../models/Teacher'




class teacherService {

  async home(data:ITeacher) {
     const home=teacerRepository.home(data)
       return home
  }
}

export default new teacherService();