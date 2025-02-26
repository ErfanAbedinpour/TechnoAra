import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from 'src/models/ticket.model';

export class ChangeStatusDto {
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;
}
