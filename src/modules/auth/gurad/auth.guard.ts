import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AUTH_STRATEGIES, AUTH_TOKEN } from "../decorator/auth.decorator";
import { AccessTokenGuard } from "./access-token.guard";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private reflector: Reflector, private accessTokenGurad: AccessTokenGuard) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metas = this.reflector.getAllAndOverride<AUTH_STRATEGIES[]>(AUTH_TOKEN, [context.getHandler(), context.getClass()]) ?? [AUTH_STRATEGIES.BEARER]
        for (const meta of metas) {
            if (meta === AUTH_STRATEGIES.BEARER) {
                try {
                    await this.accessTokenGurad.canActivate(context);
                } catch (err) {
                    throw err
                }
            }
        }
        return false;
    }
}