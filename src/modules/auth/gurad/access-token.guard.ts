import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AccessTokenService, CurentUser } from "../tokens/accessToken.service";
import { Request } from "express";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    private readonly INVALID_TOKEN = "token is expired or invaid."
    private readonly HEADER_NOT_VALID = "header is Empty or Its not Bearer"

    constructor(private readonly accessTokenService: AccessTokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest<Request>();

        const [bearer, token] = request.headers?.authorization?.split(' ') || [];

        if (!bearer || bearer !== "bearer" || !token)
            throw new UnauthorizedException(this.HEADER_NOT_VALID)

        try {
            const paylaod = await this.accessTokenService.verify(token);
            request.user = paylaod;

        } catch (err) {
            throw new UnauthorizedException(this.INVALID_TOKEN)
        }
        return true
    }
}



declare global {
    namespace Express {
        interface Request {
            user?: CurentUser;
        }
    }
}
