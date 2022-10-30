import {Request, Response} from "express";

export async function appInfo(request: Request, response: Response) {
    response.send("Merch Server");
}