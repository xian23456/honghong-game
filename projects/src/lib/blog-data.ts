import { getSupabaseClient } from "@/storage/database/supabase-client";

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("blog_posts")
    .select("id, title, summary, content, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`查询文章列表失败: ${error.message}`);
  return data as BlogPost[];
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("blog_posts")
    .select("id, title, summary, content, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`查询文章详情失败: ${error.message}`);
  return data as BlogPost | null;
}

export async function insertPost(title: string, summary: string, content: string): Promise<BlogPost> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("blog_posts")
    .insert({ title, summary, content })
    .select()
    .single();
  if (error) throw new Error(`插入文章失败: ${error.message}`);
  return data as BlogPost;
}
