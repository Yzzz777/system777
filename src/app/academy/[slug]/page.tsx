import Link from "next/link";
import { Code, Shield, Terminal, MessageSquare, Cloud, Database, ArrowLeft, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";

const academies: Record<string, {
  name: string;
  icon: typeof Code;
  color: string;
  description: string;
  courses: { title: string; level: string; lessons: number }[];
  topics: string[];
}> = {
  programming: {
    name: "Programming Academy",
    icon: Code,
    color: "#00FF88",
    description: "Master HTML, CSS, JavaScript, React, Next.js, Python, Java, and 20+ more languages and frameworks.",
    courses: [
      { title: "HTML & CSS Fundamentals", level: "BEGINNER", lessons: 24 },
      { title: "JavaScript Mastery", level: "BEGINNER", lessons: 32 },
      { title: "TypeScript Pro", level: "INTERMEDIATE", lessons: 20 },
      { title: "React & Next.js", level: "INTERMEDIATE", lessons: 28 },
      { title: "Python for Developers", level: "BEGINNER", lessons: 30 },
      { title: "Java Enterprise", level: "ADVANCED", lessons: 35 },
      { title: "Node.js Backend", level: "INTERMEDIATE", lessons: 22 },
      { title: "Rust Systems Programming", level: "EXPERT", lessons: 18 },
    ],
    topics: ["HTML & CSS", "JavaScript", "TypeScript", "React & Next.js", "Python", "Java", "C#", "Go", "Rust", "PHP & Laravel", "Node.js", "Vue.js"],
  },
  cybersecurity: {
    name: "Cybersecurity Academy",
    icon: Shield,
    color: "#00C8FF",
    description: "Learn ethical hacking, penetration testing, forensics, SOC analysis, Red/Blue/Purple team operations.",
    courses: [
      { title: "Ethical Hacking Fundamentals", level: "BEGINNER", lessons: 28 },
      { title: "Penetration Testing", level: "INTERMEDIATE", lessons: 30 },
      { title: "Kali Linux Mastery", level: "BEGINNER", lessons: 20 },
      { title: "Network Security", level: "INTERMEDIATE", lessons: 25 },
      { title: "Digital Forensics", level: "ADVANCED", lessons: 22 },
      { title: "Malware Analysis", level: "EXPERT", lessons: 18 },
    ],
    topics: ["Ethical Hacking", "Penetration Testing", "Kali Linux", "Network Security", "Digital Forensics", "Malware Analysis", "OSINT", "SOC Analysis", "Red Team", "Blue Team", "Bug Bounty"],
  },
  discord: {
    name: "Discord Development Academy",
    icon: MessageSquare,
    color: "#7C3AED",
    description: "Build Discord bots with Discord.js and Discord.py. Create tickets, verification, economy, and music systems.",
    courses: [
      { title: "Discord.js Fundamentals", level: "BEGINNER", lessons: 20 },
      { title: "Discord.py Bot Development", level: "BEGINNER", lessons: 22 },
      { title: "Slash Commands & Interactions", level: "INTERMEDIATE", lessons: 15 },
      { title: "Ticket & Verification Systems", level: "INTERMEDIATE", lessons: 12 },
      { title: "Economy & Music Bots", level: "ADVANCED", lessons: 18 },
    ],
    topics: ["Discord.js", "Discord.py", "Slash Commands", "MongoDB for Bots", "Ticket Systems", "Verification Systems", "Economy Systems", "Music Bots", "Web Dashboards", "Sharding"],
  },
  linux: {
    name: "Linux Academy",
    icon: Terminal,
    color: "#FF6B6B",
    description: "Linux administration, server management, shell scripting, and infrastructure automation.",
    courses: [
      { title: "Linux Fundamentals", level: "BEGINNER", lessons: 25 },
      { title: "Shell Scripting", level: "INTERMEDIATE", lessons: 20 },
      { title: "System Administration", level: "INTERMEDIATE", lessons: 28 },
      { title: "Docker & Kubernetes", level: "ADVANCED", lessons: 22 },
      { title: "Server Security Hardening", level: "ADVANCED", lessons: 18 },
    ],
    topics: ["Linux Fundamentals", "Shell Scripting", "System Administration", "Network Configuration", "Security Hardening", "Docker", "Kubernetes", "Server Management"],
  },
  cloud: {
    name: "Cloud Computing Academy",
    icon: Cloud,
    color: "#FFD93D",
    description: "AWS, Azure, GCP, Cloudflare, serverless architectures and cloud-native development.",
    courses: [
      { title: "Cloud Fundamentals", level: "BEGINNER", lessons: 18 },
      { title: "AWS Certified Solutions", level: "INTERMEDIATE", lessons: 30 },
      { title: "Azure Administration", level: "INTERMEDIATE", lessons: 25 },
      { title: "Serverless Architecture", level: "ADVANCED", lessons: 20 },
      { title: "Cloud Security", level: "ADVANCED", lessons: 22 },
    ],
    topics: ["AWS", "Azure", "GCP", "Cloudflare", "Serverless", "CI/CD", "Infrastructure as Code", "Cloud Security"],
  },
  databases: {
    name: "Database Academy",
    icon: Database,
    color: "#FF8C42",
    description: "PostgreSQL, MySQL, MongoDB, Redis - database design, optimization, and scaling.",
    courses: [
      { title: "Database Design Fundamentals", level: "BEGINNER", lessons: 20 },
      { title: "PostgreSQL Mastery", level: "INTERMEDIATE", lessons: 25 },
      { title: "MongoDB & NoSQL", level: "INTERMEDIATE", lessons: 22 },
      { title: "Redis Caching", level: "ADVANCED", lessons: 15 },
      { title: "Query Optimization", level: "ADVANCED", lessons: 18 },
    ],
    topics: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Database Design", "Query Optimization", "Replication", "Sharding"],
  },
};

export function generateStaticParams() {
  return Object.keys(academies).map((slug) => ({ slug }));
}

export default async function AcademySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const academy = academies[slug];
  if (!academy) notFound();

  const Icon = academy.icon;

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4">
        <Link href="/academy" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Academias
        </Link>

        <div className="flex items-center gap-6 mb-12">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: academy.color + "15" }}>
            <Icon className="h-10 w-10" style={{ color: academy.color }} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">{academy.name}</h1>
            <p className="mt-2 text-gray-400">{academy.description}</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {academy.topics.map((topic) => (
              <span key={topic} className="rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300 border border-white/5">{topic}</span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-6">Courses ({academy.courses.length})</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {academy.courses.map((course, i) => (
              <div key={i} className="glass rounded-xl p-6 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="h-5 w-5 text-[#00FF88]" />
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: academy.color + "20", color: academy.color }}>{course.level}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-gray-400">{course.lessons} lessons</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
