import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../decorator/role.decorator";
import { Request } from "express";
import { UserRole } from "../../../models/role.model";

@Injectable()
export class RoleGurad implements CanActivate {
    private NOT_ACCESS = "you have not access to this route";
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metas = this.reflector.getAllAndOverride<UserRole[]>(ROLE_KEY, [context.getHandler(), context.getClass()]);

        if (!metas)
            return true

        const request = context.switchToHttp().getRequest<Request>();

        const result = metas.some((meta) => meta === request.user.role)

        if (!result)
            throw new ForbiddenException(this.NOT_ACCESS)

        return true;
    }
}