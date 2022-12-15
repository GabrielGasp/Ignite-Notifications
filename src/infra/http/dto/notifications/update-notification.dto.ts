import { IsOptional, Length } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  category?: string;

  @IsOptional()
  @Length(5, 200)
  content?: string;
}
