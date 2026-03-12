import { CommentEntity } from '../entities/comment.entity';

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');

export interface CommentRepository {
  save(comment: CommentEntity): Promise<void>;
  findById(id: string): Promise<CommentEntity | null>;
  findByPostId(postId: string, skip?: number, take?: number): Promise<[CommentEntity[], number]>;
  delete(id: string): Promise<void>;
  countByPostId(postId: string): Promise<number>;
}
