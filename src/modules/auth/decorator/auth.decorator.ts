import { SetMetadata } from "@nestjs/common"


export const AUTH_TOKEN = 'auth'

export enum AUTH_STRATEGIES {
    NONE = "NONE",
    BEARER = "BEARER"
}

export const Auth = (...auth: AUTH_STRATEGIES[]) => SetMetadata(AUTH_TOKEN, auth)