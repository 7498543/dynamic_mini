import { relations } from "drizzle-orm";
import {
  index,
  int,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import {
  enabledColumn,
  softDeleteColumn,
  sortColumn,
  timestamps,
} from "./shared";
import { sysUserSchema } from "./sys";

export const articleCategorySchema = sqliteTable(
  "article_category",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    ...enabledColumn(),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    slugIdx: uniqueIndex("article_category_slug_unique").on(table.slug),
    enabledIdx: index("article_category_enabled_sort_idx").on(
      table.enabled,
      table.sort,
    ),
  }),
);

export const articleTagSchema = sqliteTable(
  "article_tag",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    ...enabledColumn(),
    ...sortColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    slugIdx: uniqueIndex("article_tag_slug_unique").on(table.slug),
    enabledIdx: index("article_tag_enabled_sort_idx").on(
      table.enabled,
      table.sort,
    ),
  }),
);

export const articleSchema = sqliteTable(
  "article",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary"),
    coverImage: text("cover_image"),
    author: text("author").notNull().default(""),
    authorId: int("author_id").references(() => sysUserSchema.id, {
      onDelete: "set null",
    }),
    categoryId: int("category_id").references(() => articleCategorySchema.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    visitCount: int("visit_count").notNull().default(0),
    commentCount: int("comment_count").notNull().default(0),
    publishedAt: int("published_at", { mode: "timestamp" }),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    slugIdx: uniqueIndex("article_slug_unique").on(table.slug),
    categoryIdx: index("article_category_id_idx").on(table.categoryId),
    authorIdx: index("article_author_id_idx").on(table.authorId),
    publishedIdx: index("article_enabled_published_idx").on(
      table.enabled,
      table.publishedAt,
    ),
  }),
);

export const articleTagRelationSchema = sqliteTable(
  "article_tag_relation",
  {
    articleId: int("article_id")
      .notNull()
      .references(() => articleSchema.id, { onDelete: "cascade" }),
    tagId: int("tag_id")
      .notNull()
      .references(() => articleTagSchema.id, { onDelete: "cascade" }),
    createdAt: int("created_at", { mode: "timestamp" })
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.tagId] }),
    tagIdx: index("article_tag_relation_tag_id_idx").on(table.tagId),
  }),
);

export const articleCommentSchema = sqliteTable(
  "article_comment",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    articleId: int("article_id")
      .notNull()
      .references(() => articleSchema.id, { onDelete: "cascade" }),
    parentId: int("parent_id").references(() => articleCommentSchema.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    userId: int("user_id").references(() => sysUserSchema.id, {
      onDelete: "set null",
    }),
    nickname: text("nickname"),
    ...enabledColumn(),
    ...timestamps(),
    ...softDeleteColumn(),
  },
  (table) => ({
    articleIdx: index("article_comment_article_id_idx").on(table.articleId),
    userIdx: index("article_comment_user_id_idx").on(table.userId),
    parentIdx: index("article_comment_parent_id_idx").on(table.parentId),
  }),
);

export const articleCategoryRelations = relations(
  articleCategorySchema,
  ({ many }) => ({
    articles: many(articleSchema),
  }),
);

export const articleTagRelations = relations(articleTagSchema, ({ many }) => ({
  articles: many(articleTagRelationSchema),
}));

export const articleRelations = relations(articleSchema, ({ many, one }) => ({
  category: one(articleCategorySchema, {
    fields: [articleSchema.categoryId],
    references: [articleCategorySchema.id],
  }),
  authorUser: one(sysUserSchema, {
    fields: [articleSchema.authorId],
    references: [sysUserSchema.id],
  }),
  comments: many(articleCommentSchema),
  tags: many(articleTagRelationSchema),
}));

export const articleTagRelationRelations = relations(
  articleTagRelationSchema,
  ({ one }) => ({
    article: one(articleSchema, {
      fields: [articleTagRelationSchema.articleId],
      references: [articleSchema.id],
    }),
    tag: one(articleTagSchema, {
      fields: [articleTagRelationSchema.tagId],
      references: [articleTagSchema.id],
    }),
  }),
);

export const articleCommentRelations = relations(
  articleCommentSchema,
  ({ many, one }) => ({
    article: one(articleSchema, {
      fields: [articleCommentSchema.articleId],
      references: [articleSchema.id],
    }),
    parent: one(articleCommentSchema, {
      fields: [articleCommentSchema.parentId],
      references: [articleCommentSchema.id],
      relationName: "article_comment_thread",
    }),
    replies: many(articleCommentSchema, {
      relationName: "article_comment_thread",
    }),
    user: one(sysUserSchema, {
      fields: [articleCommentSchema.userId],
      references: [sysUserSchema.id],
    }),
  }),
);

export type Article = typeof articleSchema.$inferSelect;
export type NewArticle = typeof articleSchema.$inferInsert;
export type ArticleCategory = typeof articleCategorySchema.$inferSelect;
export type NewArticleCategory = typeof articleCategorySchema.$inferInsert;
export type ArticleTag = typeof articleTagSchema.$inferSelect;
export type NewArticleTag = typeof articleTagSchema.$inferInsert;
export type ArticleTagRelation = typeof articleTagRelationSchema.$inferSelect;
export type NewArticleTagRelation =
  typeof articleTagRelationSchema.$inferInsert;
export type ArticleComment = typeof articleCommentSchema.$inferSelect;
export type NewArticleComment = typeof articleCommentSchema.$inferInsert;
