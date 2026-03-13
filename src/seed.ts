import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// SEED SCRIPT – runs standalone against the SQLite database
// Usage: npx ts-node -r tsconfig-paths/register src/seed.ts
// ============================================================

async function seed() {
  console.log('🚀  Starting seed process...');
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DATABASE_URL ?? 'database.sqlite',
    entities: [__dirname + '/modules/**/infrastructure/entities/*.sqlite.entity.{ts,js}'],
    synchronize: true,
  });

  console.log('🔌  Connecting to database at:', process.env.DATABASE_URL ?? 'database.sqlite');
  await dataSource.initialize();
  console.log('✅  Database initialized');

  /* ---- Users ---- */
  const adminId = uuidv4();
  const authorId = uuidv4();
  const readerId = uuidv4();

  await dataSource.query(
    `INSERT INTO users (id, username, password, role, createdAt) VALUES
      (?, 'admin',  '$2b$10$hash_admin',  'admin',   datetime('now')),
      (?, 'alice',  '$2b$10$hash_alice',  'user',    datetime('now')),
      (?, 'reader', '$2b$10$hash_reader', 'user',    datetime('now'))
    `,
    [adminId, authorId, readerId],
  );

  /* ---- Tags ---- */
  const tagTs = uuidv4();
  const tagArch = uuidv4();
  const tagNode = uuidv4();

  await dataSource.query(
    `INSERT INTO tags (id, name) VALUES (?, 'typescript'), (?, 'architecture'), (?, 'nodejs')`,
    [tagTs, tagArch, tagNode],
  );

  /* ---- Posts ---- */
  const post1Id = uuidv4();
  const post2Id = uuidv4();

  await dataSource.query(
    `INSERT INTO posts (id, title, content, authorId, status, slug, createdAt) VALUES
      (?, 'Clean Architecture in NestJS', 'This post explains DDD and Clean Architecture...', ?, 'accepted', 'clean-architecture-in-nestjs', datetime('now')),
      (?, 'TypeScript Tips & Tricks',     'Powerful TypeScript features you may not know...', ?, 'accepted', 'typescript-tips-and-tricks',  datetime('now'))
    `,
    [post1Id, authorId, post2Id, authorId],
  );

  /* ---- Post Tags (ManyToMany) ---- */
  await dataSource.query(
    `INSERT INTO posts_tags (postId, tagId) VALUES (?, ?), (?, ?), (?, ?)`,
    [post1Id, tagArch, post1Id, tagNode, post2Id, tagTs],
  );

  /* ---- Comments ---- */
  const comment1Id = uuidv4();
  const comment2Id = uuidv4();

  await dataSource.query(
    `INSERT INTO comments (id, content, authorId, postId, createdAt) VALUES
      (?, 'Great overview of Clean Architecture!', ?, ?, datetime('now')),
      (?, 'Very helpful TypeScript tips!',         ?, ?, datetime('now'))
    `,
    [comment1Id, readerId, post1Id, comment2Id, readerId, post2Id],
  );

  /* ---- Subscriptions (reader follows alice) ---- */
  await dataSource.query(
    `INSERT INTO subscriptions (id, subscriberId, targetId, createdAt) VALUES (?, ?, ?, datetime('now'))`,
    [uuidv4(), readerId, authorId],
  );

  /* ---- Notifications ---- */
  await dataSource.query(
    `INSERT INTO notifications (id, recipientId, type, message, referenceId, isRead, createdAt) VALUES
      (?, ?, 'NEW_POST',    'A user you follow published a new post!', ?, 0, datetime('now')),
      (?, ?, 'NEW_COMMENT', 'Someone commented on your post!',         ?, 0, datetime('now'))
    `,
    [uuidv4(), readerId, post1Id, uuidv4(), authorId, comment1Id],
  );

  console.log('✅  Seed completed successfully');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
