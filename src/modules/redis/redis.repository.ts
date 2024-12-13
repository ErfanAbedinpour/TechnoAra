import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { IRedis } from "./redis.interface";
import { Redis } from "ioredis";

export class RedisRepository implements IRedis, OnApplicationBootstrap, OnApplicationShutdown {
    redis: Redis
    async onApplicationBootstrap() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
        })
    }

    onApplicationShutdown(signal?: string) {
        this.redis.disconnect();
    }

    async set(key: string, value: string, ttl?: number): Promise<string> {
        const res = this.redis.set(key, value)
        if (ttl)
            this.redis.expire(key, ttl)
        return res;
    }

    async get(key: string): Promise<string> {
        return this.redis.get(key);
    }

    async del(key: string): Promise<boolean> {
        return !!(this.redis.del(key))
    }
}