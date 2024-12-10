import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { CurentUser } from "../tokens/accessToken.service";



export const GetUser = createParamDecorator(
    (data: keyof Partial<CurentUser>, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>();
        return data ? request.user[data] : request.user;
    })