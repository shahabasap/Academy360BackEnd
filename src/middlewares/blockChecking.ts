import AuthService from "../services/AuthService";


class BlockChecking{
    async StudentIsBlocked(id:string)
    {
        const student=await AuthService.StudentIsBlocked(id)
        if(student.valid)
        {
            return {valid:true}
        }
        else
        {
            return {valid:false}
        }
    }
    async TeacherIsBlocked(id:string)
    {
        const teacher=await AuthService.TeacherIsBlocked(id)
        if(teacher.valid)
        {
            return {valid:true}
        }
        else
        {
            return {valid:false}
        }
    }
}

export default new BlockChecking()