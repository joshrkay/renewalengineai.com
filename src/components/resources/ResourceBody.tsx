import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Resource articles use GFM features (tables, strikethrough, autolinks) that
// the course LessonBody doesn't need. Kept separate so styling can diverge
// if/when articles want a different visual voice than lessons.
const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl md:text-5xl font-black text-white mt-12 mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-black text-white mt-16 mb-5 scroll-mt-28">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold text-white mt-10 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-lg text-neutral-300 leading-relaxed mb-5">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-6 space-y-2 text-lg text-neutral-300 mb-6">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-6 space-y-2 text-lg text-neutral-300 mb-6">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="text-white font-bold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-neutral-200">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-600 pl-6 py-2 my-6 text-neutral-200 italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-neutral-800 text-blue-300 px-2 py-0.5 rounded text-base">
      {children}
    </code>
  ),
  a: ({ children, href }) => {
    const internal = typeof href === "string" && href.startsWith("/");
    return (
      <a
        href={href}
        className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
        rel={internal ? undefined : "noopener"}
      >
        {children}
      </a>
    );
  },
  hr: () => <hr className="border-neutral-800 my-12" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border border-neutral-800 rounded-2xl overflow-hidden text-left">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-900">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-sm uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-neutral-300 border-b border-neutral-800 align-top">
      {children}
    </td>
  ),
};

export function ResourceBody({ body }: { body: string }) {
  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {body}
    </ReactMarkdown>
  );
}
