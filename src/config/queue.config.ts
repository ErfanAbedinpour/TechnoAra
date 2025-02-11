import { QueueOptions } from "bullmq";

export const queueConfig: QueueOptions = {
    connection: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT
    },
} 