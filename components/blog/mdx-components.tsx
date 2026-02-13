import type { MDXComponents } from "mdx/types"

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className="text-3xl font-bold mt-8 mb-4" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-2xl font-semibold mt-6 mb-3" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-xl font-semibold mt-4 mb-2" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-7" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="mb-1" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-bold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  a: ({ children, href, ...props }) => (
    <a href={href} className="text-blue-600 hover:text-blue-800 underline" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
      {children}
    </pre>
  ),
}
