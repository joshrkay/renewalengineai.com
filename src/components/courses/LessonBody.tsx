import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl md:text-5xl font-black text-white mt-12 mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-black text-white mt-12 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold text-white mt-8 mb-3">
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
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-neutral-800 my-10" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-8">
      <table className="min-w-full border border-neutral-800 rounded-2xl overflow-hidden text-left">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-neutral-900">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-white font-bold text-sm uppercase tracking-wide border-b border-neutral-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-neutral-300 border-b border-neutral-800 align-top">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    // span elements (not div) so react-markdown can legally nest them
    // inside the implicit <p> wrapper without a hydration warning.
    <span className="block my-10">
      <span className="block rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-6">
        <img
          src={typeof src === "string" ? src : ""}
          alt={alt ?? ""}
          className="w-full h-auto block"
        />
      </span>
      {alt && (
        <span className="block text-sm text-neutral-500 text-center mt-3 italic">
          {alt}
        </span>
      )}
    </span>
  ),
};

export function LessonBody({ body }: { body: string }) {
  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {body}
    </ReactMarkdown>
  );
}
