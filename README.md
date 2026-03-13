# Blog API – Software Architecture Final Exam

A RESTful Blog API built with **NestJS**, **TypeORM** (SQLite), and **Domain-Driven Design** principles.

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- npm

### Install & Run

```bash
npm install
# Create a .env file with:
# DATABASE_URL=database.sqlite
# NODE_ENV=development
# PORT=3000

npm run start:dev
```

### Swagger Docs
Open [http://localhost:3000/api](http://localhost:3000/api) after starting the server.

### Seed the Database

```bash
npm run seed
```

This populates users, tags, posts (with slugs), comments, subscriptions, and notifications.

### Run Tests

```bash
npm test
```

---

## 📐 Architecture Overview

The project follows **Clean Architecture** and **Domain-Driven Design**:

```
src/modules/<feature>/
  domain/
    entities/         ← Domain entities (pure TypeScript classes)
    value-objects/    ← Immutable value objects with validation
    repositories/     ← Abstract repository interfaces
    events/           ← Domain event constants & payloads
    exceptions/       ← Domain-specific exceptions
  application/
    use-cases/        ← One class per use case (business logic)
    dtos/             ← Input validation DTOs
    listeners/        ← Event listeners (Notifications)
  infrastructure/
    entities/         ← TypeORM (SQLite) entity classes
    repositories/     ← Concrete repository implementations
    controllers/      ← NestJS REST controllers
```

### Key Patterns

| Pattern | Description |
|---|---|
| **Use Case per Action** | Each business operation has its own class (`CreatePostUseCase`, `FollowUserUseCase`, etc.) |
| **Repository Abstraction** | Domain does not depend on the database; infrastructure implements the interface |
| **Domain Events** | `EventEmitter2` decouples Posts/Comments from Notifications |
| **Value Objects** | `PostTitle`, `PostContent`, `PostSlug`, `CommentContent` encapsulate validation rules |
| **Permission Objects** | `PostPermissions`, `UserPermissions` keep authorization logic in the domain |

---

## 📋 API Reference

### Authentication
All protected routes require `Authorization: Bearer <jwt>`.

### Posts
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/posts` | Optional | List posts (filter: `?tags=ts,node`) |
| POST | `/posts` | ✅ | Create post |
| GET | `/posts/:id` | Optional | Get post by ID or slug |
| PATCH | `/posts/:id` | ✅ | Update post |
| DELETE | `/posts/:id` | ✅ | Delete post |
| PATCH | `/posts/:id/slug` | ✅ Author/Admin | Update post slug |
| POST | `/posts/:postId/tags/:tagId` | ✅ Author/Admin | Add tag to post |
| DELETE | `/posts/:postId/tags/:tagId` | ✅ Author/Admin | Remove tag from post |

### Tags
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/tags` | ❌ | List all tags |
| POST | `/tags` | ✅ Admin | Create tag |
| PATCH | `/tags/:id` | ✅ Admin | Update tag |
| DELETE | `/tags/:id` | ✅ Admin | Delete tag |

### Comments
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/posts/:postId/comments` | Optional | List comments (pagination: `?skip=0&take=10`) |
| GET | `/posts/:postId/comments/count` | Optional | Get comment count |
| POST | `/posts/:postId/comments` | ✅ | Create comment (accepted posts only) |
| PATCH | `/comments/:id` | ✅ Author | Update comment |
| DELETE | `/comments/:id` | ✅ Author/PostAuthor/Admin | Delete comment |

### Subscriptions
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/users/:userId/follow` | ✅ | Follow user |
| DELETE | `/users/:userId/follow` | ✅ | Unfollow user |
| GET | `/users/:userId/followers` | Optional | Get user's followers |
| GET | `/users/:userId/following` | Optional | Get users being followed |

### Notifications
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | ✅ | Get my notifications (`?skip=&take=&unreadOnly=true`) |
| PATCH | `/notifications/:id/read` | ✅ | Mark notification as read |
| POST | `/notifications/mark-all-read` | ✅ | Mark all notifications as read |

---

## 🔔 Event-Driven Notifications

Notifications are generated automatically without coupling the Posts/Comments modules to Notifications:

- **`post.created`** → Notifies all followers of the author
- **`comment.created`** → Notifies the post author

---

## 🧪 Testing

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

Unit tests cover:
- `CreatePostUseCase` – permissions, slug generation, event emission
- `CreateCommentUseCase` – accepted post guard, event emission, not-found handling
- `FollowUserUseCase` – self-follow prevention, duplicate guard, not-found user
- `MarkNotificationAsReadUseCase` – auth guard, not-found, ownership check
