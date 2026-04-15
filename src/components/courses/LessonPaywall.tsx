import Link from "next/link";
import { formatPrice } from "@/lib/courses";

type Props = {
  courseTitle: string;
  coursePrice: number;
  courseHref: string;
  returnHref: string;
  reason: "unauthenticated" | "not_entitled";
};

export function LessonPaywall({
  courseTitle,
  coursePrice,
  courseHref,
  returnHref,
  reason,
}: Props) {
  const isLoggedOut = reason === "unauthenticated";

  const loginHref = `/login?callbackUrl=${encodeURIComponent(returnHref)}`;

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-2xl p-8 md:p-12 my-10">
      <p className="text-blue-500 font-bold uppercase tracking-wider text-xs mb-3">
        Members-only lesson
      </p>
      <h2 className="text-3xl md:text-4xl font-black mb-4">
        This lesson is part of {courseTitle}
      </h2>
      <p className="text-neutral-300 text-lg mb-6 max-w-2xl">
        {isLoggedOut
          ? "Sign in with the account you used to enroll, or grab the course below to unlock every lesson, template, and prompt."
          : `Your account doesn't include ${courseTitle} yet. Enroll below to unlock every lesson, template, and prompt.`}
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <span className="text-3xl font-black text-white">
          {formatPrice(coursePrice)}
        </span>
        <span className="text-neutral-500 text-sm">
          One-time · lifetime access · 30-day guarantee
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={courseHref}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 py-4 transition-colors"
        >
          Enroll in {courseTitle}
        </Link>
        {isLoggedOut && (
          <Link
            href={loginHref}
            className="inline-block border border-neutral-700 hover:border-neutral-500 text-white font-semibold rounded-full px-8 py-4 transition-colors"
          >
            I already have an account
          </Link>
        )}
      </div>

      <p className="text-neutral-500 text-xs mt-6">
        The first lesson of module 1 is free so you can get a feel for the
        material before you buy.
      </p>
    </div>
  );
}
