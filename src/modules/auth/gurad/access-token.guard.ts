import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { AccessTokenService, CurentUser } from "../tokens/accessToken.service";
import { Request } from "express";
import { BlackListService } from "../blacklist/blacklist.service";
import { JsonWebTokenError } from "@nestjs/jwt";

@Injectable()
export class AccessTokenGuard implements CanActivate {
    private readonly INVALID_TOKEN = "token invaid."
    private readonly HEADER_NOT_VALID = "header is Empty or its not Bearer."
    private readonly TOKEN_BLOCKED = "token is blocked"

    private logger = new Logger(AccessTokenGuard.name);
    constructor(private readonly accessTokenService: AccessTokenService, private readonly blackListService: BlackListService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest<Request>();

        const [bearer, token] = request.headers?.authorization?.split(' ') || [];

        if (!bearer || bearer.toLocaleLowerCase() !== "bearer" || !token)
            throw new UnauthorizedException(this.HEADER_NOT_VALID)

        try {
            const isBlocked = await this.blackListService.isInBlackList(token);

            if (isBlocked)
                throw new ForbiddenException(this.TOKEN_BLOCKED);

            const paylaod = await this.accessTokenService.verify(token);

            request.user = paylaod;
            request.token = token;
            return true

        } catch (err) {
            if (err instanceof JsonWebTokenError)
                throw new UnauthorizedException(this.INVALID_TOKEN)
            if (err instanceof HttpException)
                throw err;

            this.logger.error(err)
            throw new InternalServerErrorException();
        }
    }
}




declare global {
    namespace Express {
        interface Request {
            user?: CurentUser;
            token?: string
        }
    }
}
