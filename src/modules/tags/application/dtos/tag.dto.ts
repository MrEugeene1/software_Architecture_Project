import { IsString, Length, Matches } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'name must be lowercase, alphanumeric and may contain hyphens',
  })
  name: string;
}

export class UpdateTagDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'name must be lowercase, alphanumeric and may contain hyphens',
  })
  name: string;
}
