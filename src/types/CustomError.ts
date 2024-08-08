
export interface CustomError extends Error {
    status?: number;
    message: string;
}

export  class CustomErrorClass extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}
