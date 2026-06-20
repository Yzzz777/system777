import Link from "next/link";
import { Code, Shield, Terminal, MessageSquare, Cloud, Database, ArrowRight } from "lucide-react";

const academies = [
  {
    name: "Programming Academy",
    slug: "programming",
    icon: Code,
    color: "#00FF88",
    description: "Master HTML, CSS, JavaScript, React, Next.js, Python, Java, and 20+ more languages and frameworks.",
    courses: 85,
    topics: ["HTML & CSS", "JavaScript", "TypeScript", "React & Next.js", "Python", "Java", "C#", "Go", "Rust", "PHP & Laravel", "Node.js", "Vue.js"],
  },
  {
    name: "Cybersecurity Academy",
    slug: "cybersecurity",
    icon: Shield,
    color: "#00C8FF",
    description: "Learn ethical hacking, penetration testing, forensics, SOC analysis, Red/Blue/Purple team operations.",
    courses: 45,
    topics: ["Ethical Hacking", "Penetration Testing", "Kali Linux", "Network Security", "Digital Forensics", "Malware Analysis", "OSINT", "SOC Analysis", "Red Team", "Blue Team", "Bug Bounty"],
  },
  {
    name: "Discord Development Academy",
    slug: "discord",
    icon: MessageSquare,
    color: "#7C3AED",
    description: "Build Discord bots with Discord.js and Discord.py. Create tickets, verification, economy, and music systems.",
    courses: 30,
    topics: ["Discord.js", "Discord.py", "Slash Commands", "MongoDB for Bots", "Ticket Systems", "Verification Systems", "Economy Systems", "Music Bots", "Web Dashboards", "Sharding"],
  },
  {
    name: "Linux Academy",
    slug: "linux",
    icon: Terminal,
    color: "#FF6B6B",
    description: "Linux administration, server management, shell scripting, and infrastructure automation.",
    courses: 35,
    topics: ["Linux Fundamentals", "Shell Scripting", "System Administration", "Network Configuration", "Security Hardening", "Docker", "Kubernetes", "Server Management"],
  },
  {
    name: "Cloud Computing Academy",
    slug: "cloud",
    icon: Cloud,
    color: "#FFD93D",
    description: "AWS, Azure, GCP, Cloudflare, serverless architectures and cloud-native development.",
    courses: 25,
    topics: ["AWS", "Azure", "GCP", "Cloudflare", "Serverless", "CI/CD", "Infrastructure as Code", "Cloud Security"],
  },
  {
    name: "Database Academy",
    slug: "databases",
    icon: Database,
    color: "#FF8C42",
    description: "PostgreSQL, MySQL, MongoDB, Redis - database design, optimization, and scaling.",
    courses: 20,
    topics: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Database Design", "Query Optimization", "Replication", "Sharding"],
  },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Our Academies</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Specialized academies for every tech path. Choose your journey.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {academies.map((academy) => (
            <Link key={academy.slug} href={`/academy/${academy.slug}`} className="group glass block rounded-2xl p-8 transition-all hover:border-white/10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: academy.color + "15" }}>
                    <academy.icon className="h-8 w-8" style={{ color: academy.color }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-[#00FF88] transition-colors">
                      {academy.name}
                    </h2>
                    <p className="mt-2 max-w-xl text-gray-400">{academy.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {academy.topics.slice(0, 6).map((topic) => (
                        <span key={topic} className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                          {topic}
                        </span>
                      ))}
                      {academy.topics.length > 6 && (
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
                          +{academy.topics.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{academy.courses}</div>
                    <div className="text-xs text-gray-500">Courses</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black transition-all group-hover:bg-[#00CC6A]">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
