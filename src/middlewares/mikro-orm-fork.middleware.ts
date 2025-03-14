import { RequestContext } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/postgresql';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ForkEntityManagerMiddleware implements NestMiddleware {
    constructor(private readonly orm: MikroORM) { }
    use(req: Request, res: Response, next: NextFunction) {
        RequestContext.create(this.orm.em, next);
    }
}