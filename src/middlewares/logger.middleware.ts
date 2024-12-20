import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger(LoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const { ip, hostname, originalUrl } = req;
        this.logger.log({
            ip,
            hostname,
            originalUrl
        })

        next();
    }
}
