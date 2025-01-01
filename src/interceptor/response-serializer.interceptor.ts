import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_TYPE } from '../decorator/resposne-stucture.decorator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ResponseSerializerInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => {
            // get responseDto From Decorator 
            const respDto = this.reflector.get(RESPONSE_TYPE, context.getHandler()) || null;
            // if does not have dto return pure data
            if (!respDto) return data;

            // convert plain response to instance of dto
            const resInstance = plainToInstance(respDto, data, { exposeUnsetFields: true, exposeDefaultValues: true, excludeExtraneousValues: true });

            return resInstance;
        }));
    }
}