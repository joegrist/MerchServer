import {Request, Response} from "express";
import {Merchant} from "../../../common/entity/merchant";
import {ds} from "../../../common/dataSource"

export async function listAllMerchants(request: Request, response: Response) {

    // get a post repository to perform operations with post
    const postRepository = ds.getRepository(Merchant);

    // load posts
    const posts = await postRepository.find();

    // return loaded posts
    response.setHeader('content-type', 'application/json');
    response.send(posts);
}