import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(1, 500)
  content: string;
}

export class UpdateCommentDto {
  @IsString()
  @Length(1, 500)
  content: string;
}
