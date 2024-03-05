import { time } from "console";

export class Utilidades{
    public static aLog(mensaje:string){
        let fecha= new Date();
        console.log (`[${fecha.toISOString()}] ${mensaje}`);
    }
}