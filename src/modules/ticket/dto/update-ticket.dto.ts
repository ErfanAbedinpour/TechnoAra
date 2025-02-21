import { PartialType } from "@nestjs/swagger";
import { CreateTicketDto } from "./create-ticket.dto";
import { TicketStatus } from "../../../models/ticket.model";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsOptional()
    @IsEnum(TicketStatus, { message: "status is invalida" })
    status?: TicketStatus
}