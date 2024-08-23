import Index from "../repositories/index";

export default 
 async function generateClassroomId(): Promise<string> {
    const prefix = '#c';
    const randomString = Math.random().toString(36).substr(2, 9);
    const Cid = `${prefix}${randomString}`;
    
    const isExist = await Index.findId(Cid);

    if (!isExist) {
        return Cid;
    } else {
        return await generateClassroomId(); // Ensure the recursive call is returned
    }
}



