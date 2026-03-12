import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TAG_REPOSITORY } from './domain/repositories/tag.repository';
import { SQLiteTagEntity } from './infrastructure/entities/tag.sqlite.entity';
import { SQLiteTagRepository } from './infrastructure/repositories/tag.sqlite.repository';
import { TagsController } from './infrastructure/controllers/tags.controller';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { ListTagsUseCase } from './application/use-cases/list-tags.use-case';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([SQLiteTagEntity])],
  controllers: [TagsController],
  providers: [
    {
      provide: TAG_REPOSITORY,
      useClass: SQLiteTagRepository,
    },
    CreateTagUseCase,
    ListTagsUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
  ],
  exports: [TAG_REPOSITORY], // Might be useful for Posts module when validating tags
})
export class TagsModule {}
