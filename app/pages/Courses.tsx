import { Link } from "react-router-dom";
import { listCourses } from "../lib/courses";

type CatalogItem = {
  slug: string;
  title: string;
  tagline: string;
  priceLabel: string;
  format: string;
  cta: string;
  to: string;
};

const staticItems: CatalogItem[] = [
  {
    slug: "mastermind",
    title: "AI Mastermind & Community",
    tagline: "Ongoing access: live calls, peer community, and new content every month",
    priceLabel: "$97 – $197 / month",
    format: "Membership",
    cta: "Learn more",
    to: "/mastermind",
  },
  {
    slug: "team-licenses",
    title: "Agency Team Licenses",
    tagline: "Multi-seat access so your whole agency can learn together",
    priceLabel: "Custom pricing",
    format: "Team license",
    cta: "Contact us",
    to: "/team-licenses",
  },
];

export default function Courses() {
  const courses = listCourses();

  return (
    <main className="bg-black text-white min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <p className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-4">
            DIY Courses
          </p>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Learn to Use AI to Keep More of Your Book
          </h1>
          <p className="text-xl text-neutral-300">
            Self-paced courses that teach independent insurance agents how to put AI to work in
            their day-to-day operations. No fluff. No jargon. Just actionable strategies you can
            implement this week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {courses.map((course) => (
            <Link
              key={course.slug}
              to={`/courses/${course.slug}`}
              className="group block bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Self-paced course
                </span>
              </div>
              <h2 className="text-2xl font-black mb-3 group-hover:text-blue-500 transition-colors">
                {course.title}
              </h2>
              <p className="text-neutral-400 mb-6">{course.tagline}</p>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <span className="text-xl font-bold text-white">
                  {course.priceHigh
                    ? `$${course.price} – $${course.priceHigh}`
                    : course.price
                      ? `$${course.price}`
                      : "Contact us"}
                </span>
                <span className="text-blue-500 font-semibold group-hover:translate-x-1 transition-transform">
                  View course →
                </span>
              </div>
            </Link>
          ))}

          {staticItems.map((item) => (
            <Link
              key={item.slug}
              to={item.to}
              className="group block bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-blue-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  {item.format}
                </span>
              </div>
              <h2 className="text-2xl font-black mb-3 group-hover:text-blue-500 transition-colors">
                {item.title}
              </h2>
              <p className="text-neutral-400 mb-6">{item.tagline}</p>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <span className="text-xl font-bold text-white">{item.priceLabel}</span>
                <span className="text-blue-500 font-semibold group-hover:translate-x-1 transition-transform">
                  {item.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-10 text-center">
          <h3 className="text-3xl font-black mb-4">Not sure which course is right for you?</h3>
          <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
            If you have fewer than 1,000 policies and want a focused retention system, start with
            AI for Agent Retention. If you run a team and want AI across the whole agency, the
            Bootcamp is built for that.
          </p>
          <a
            href="/book.html"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-4 transition-colors"
          >
            Book a 15-minute call
          </a>
        </div>
      </div>
    </main>
  );
}
