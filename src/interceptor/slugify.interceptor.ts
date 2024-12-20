import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import slugify from 'slugify';

@Injectable()
export class SlugifyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>()
        if (req.body && req.body.slug) {
            req.body.slug = slugify(req.body.slug, { trim: true, lower: true, replacement: '-' });
        }
        console.log('slug is :', req.body?.slug)
        return next
            .handle()
    }
}