import { SetMetadata } from "@nestjs/common";
import { ResponseDto } from "../abstract/response.abstract";


export const RESPONSE_TYPE = "RESPONSE_TYPE"

export const ResponeStructure = (dto: ResponseDto) => SetMetadata(RESPONSE_TYPE, dto)