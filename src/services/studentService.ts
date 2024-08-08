import studentRepository from "../repositories/studentRepository";
// import { CustomErrorClass } from "../types/CustomError";
import {IStudent} from '../models/Student'



class studentService {
 
  async home(data:IStudent) {
    const home = await studentRepository.home(data);
    return home

  }
}

export default new studentService();
