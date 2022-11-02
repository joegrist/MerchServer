import {Request, Response} from "express";
import {version} from '../../../../package.json';

export async function appInfo(request: Request, response: Response) {
    response.setHeader('content-type', 'application/json');
    var appInfo = {
        "name" : "Merch Server",
        "version" : version
    }
    response.send(appInfo);
}