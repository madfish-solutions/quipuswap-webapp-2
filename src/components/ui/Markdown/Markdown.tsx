import React from 'react';
import ReactMarkdown from 'react-markdown';

type MarkdownProps = {
  className?:string
  children: string
};

export const Markdown: React.FC<MarkdownProps> = ({
  children,
}) => (
  <ReactMarkdown>{children}</ReactMarkdown>
);
