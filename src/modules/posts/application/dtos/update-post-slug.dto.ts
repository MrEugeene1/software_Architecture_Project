import { IsLowercase, IsString, Length, Matches, NotContains } from 'class-validator';

export class UpdatePostSlugDto {
  @IsString()
  @IsLowercase()
  @Length(3, 100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase, alphanumeric and may contain hyphens',
  })
  @NotContains('--', { message: 'slug must not contain consecutive hyphens' })
  slug: string;
}
