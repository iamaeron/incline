import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface Blog {
  content: string;
  title: string;
  date: string;
  author: string;
  description: string;
  slug: string;
  readingTime: number;
}

const blogsDir = path.resolve(process.env.PWD + "/blogs");

const determineReadingTime = (article: string) => {
  const wpm = 225;
  const words = article.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);

  return time;
};

export const getAllBlogs = () => {
  const blogFiles = fs.readdirSync(blogsDir);
  const blogPosts = blogFiles.filter((file) => file.endsWith(".md"));

  const blogs = blogPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`${blogsDir}/${fileName}`, "utf-8");
    const blogData = matter(fileContents);
    const readingTime = determineReadingTime(blogData.content);

    return {
      title: blogData.data.title,
      date: blogData.data.date,
      description: blogData.data.description,
      author: blogData.data.author,
      slug: fileName.replace(".md", ""),
      readingTime,
    };
  });

  return blogs;
};

export const getBlogBySlug = (slug: string): Blog => {
  const fileContents = fs.readFileSync(`${blogsDir}/${slug}.md`, "utf-8");
  const blogData = matter(fileContents);
  const readingTime = determineReadingTime(blogData.content);

  return {
    content: blogData.content,
    title: blogData.data.title,
    date: blogData.data.date,
    author: blogData.data.author,
    description: blogData.data.description,
    slug,
    readingTime,
  };
};