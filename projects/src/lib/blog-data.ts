import { desc, eq } from "drizzle-orm";
import { db } from "@/storage/database/db";
import { blogPosts } from "@/storage/database/shared/schema";

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      summary: blogPosts.summary,
      content: blogPosts.content,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    created_at: row.createdAt,
  }));
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  const [row] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      summary: blogPosts.summary,
      content: blogPosts.content,
      createdAt: blogPosts.createdAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.id, id));

  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    created_at: row.createdAt,
  };
}

export async function insertPost(title: string, summary: string, content: string): Promise<BlogPost> {
  const [row] = await db
    .insert(blogPosts)
    .values({ title, summary, content })
    .returning({
      id: blogPosts.id,
      title: blogPosts.title,
      summary: blogPosts.summary,
      content: blogPosts.content,
      createdAt: blogPosts.createdAt,
    });

  if (!row) throw new Error("插入文章失败");
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    created_at: row.createdAt,
  };
}
