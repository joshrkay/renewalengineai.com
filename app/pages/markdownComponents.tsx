import type { Components } from "react-markdown";

// Tailwind-styled components for react-markdown. Replaces the need for
// @tailwindcss/typography, which isn't installed.
export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl md:text-5xl font-black text-white mt-10 mb-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-black text-white mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold text-white mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => <p className="text-neutral-300 leading-relaxed mb-5">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 text-neutral-300 mb-5 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 text-neutral-300 mb-5 space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
  em: ({ children }) => <em className="text-neutral-200 italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-600 pl-5 my-6 text-neutral-200 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-neutral-800 text-blue-300 px-1.5 py-0.5 rounded text-sm">{children}</code>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-blue-500 hover:text-blue-400 underline">
      {children}
    </a>
  ),
  hr: () => <hr className="border-neutral-800 my-8" />,
};
