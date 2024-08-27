
import Classroom from "../models/Classroom";

class  Index{

async findId(id:string){
    return await Classroom.findOne({classroomid:id})
}


}

export default new Index