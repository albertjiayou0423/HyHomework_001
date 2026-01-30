"use client";

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-invert max-w-none
      prose-headings:border-b prose-headings:border-[#30363d] prose-headings:pb-2
      prose-a:text-[#58a6ff] prose-a:no-underline hover:prose-a:underline
      prose-code:bg-[#30363d] prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-[#30363d]
      prose-img:rounded-md prose-img:border prose-img:border-[#30363d]
      text-[#e6edf3]">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-semibold mt-6 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-5 mb-3" {...props} />,
          p: ({node, ...props}) => <p className="my-3 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc ml-6 my-3" {...props} />,
          li: ({node, ...props}) => <li className="my-1" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
