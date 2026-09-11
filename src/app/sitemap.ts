import type { MetadataRoute } from "next";
import { curriculum } from "@/content/curriculum";
import { challenges } from "@/content/challenges";
import { projects } from "@/content/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://javascript-0-hero.vercel.app";
  const staticRoutes = [
    "",
    "/learn",
    "/roadmap",
    "/practice",
    "/practice/debug",
    "/projects",
    "/playground",
    "/dashboard",
    "/skills",
    "/interview",
    "/career",
    "/resources/cheatsheets",
  ];
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "weekly" as const,
    })),
    ...curriculum.flatMap((w) => [
      { url: `${base}/learn/week/${w.number}` },
      { url: `${base}/learn/week/${w.number}/quiz` },
      ...w.lessons.map((l) => ({
        url: `${base}/learn/week/${w.number}/${l.slug}`,
      })),
      ...w.days.map((d) => ({
        url: `${base}/session/${w.number}/${d.day}`,
      })),
    ]),
    ...challenges.map((c) => ({ url: `${base}/practice/challenge/${c.slug}` })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
