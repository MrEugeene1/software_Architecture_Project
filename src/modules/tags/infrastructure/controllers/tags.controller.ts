import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequireRole } from '../../../shared/auth/infrastructure/decorators/require-role.decorator';
import { RoleGuard } from '../../../shared/auth/infrastructure/guards/role.guard';
import { CreateTagDto, UpdateTagDto } from '../../application/dtos/tag.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.use-case';
import { ListTagsUseCase } from '../../application/use-cases/list-tags.use-case';
import { UpdateTagUseCase } from '../../application/use-cases/update-tag.use-case';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequireRole('ADMIN')
  async createTag(@Body() createTagDto: CreateTagDto) {
    return this.createTagUseCase.execute(createTagDto);
  }

  @Get()
  async listTags() {
    return this.listTagsUseCase.execute();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequireRole('ADMIN')
  async updateTag(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.updateTagUseCase.execute(id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @RequireRole('ADMIN')
  @HttpCode(204)
  async deleteTag(@Param('id') id: string) {
    await this.deleteTagUseCase.execute(id);
  }
}
