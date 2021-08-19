import React, { useContext } from 'react';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { Button } from '@components/ui/Button';

import s from './Markdown.module.sass';

const transformBeginningOfMarkdown = (markdown:string): string => {
  const startLines = markdown.split('---');
  if ((markdown.startsWith('---') && startLines.length > 2)) {
    return `\`\`\`${startLines[1]}\`\`\`${startLines.slice(2).join('---')}`;
  }
  return markdown;
};

type MarkdownProps = {
  className?:string
  markdown: string
};

const themeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Markdown: React.FC<MarkdownProps> = ({
  markdown,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const remark = transformBeginningOfMarkdown(markdown);
  return (
    <div className={themeClass[colorThemeMode]}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          blockquote({
            node, className, children, ...props
          }) {
            return (
              <blockquote className={cx(className, s.blockquote)} {...props}>
                {children}
              </blockquote>
            );
          },
          a({
            node, className, children, ...props
          }) {
            const link = props.href;
            if (link?.startsWith('./')) {
              return (
                <Button
                  className={className}
                  theme="underlined"
                >
                  {children}
                </Button>
              );
            }
            return (
              <Button
                className={className}
                href={link}
                theme="underlined"
              >
                {children}
              </Button>
            );
          },
          p({
            node, className, children, ...props
          }) {
            return (
              <p className={cx(className, s.p)} {...props}>
                {children}
              </p>
            );
          },
          ul({
            node, className, children, ...props
          }) {
            return (
              <ul className={cx(className, s.ul)} {...props}>
                {children}
              </ul>
            );
          },
          li({
            node, className, children, ...props
          }) {
            return (
              <li className={cx(className, s.li)} {...props}>
                {children}
              </li>
            );
          },
          h1({
            node, className, children, ...props
          }) {
            return (
              <h1 className={cx(className, s.h1)} {...props}>
                {children}
              </h1>
            );
          },
          h2({
            node, className, children, ...props
          }) {
            return (
              <h2 className={cx(className, s.h2)} {...props}>
                {children}
              </h2>
            );
          },
          h3({
            node, className, children, ...props
          }) {
            return (
              <h3 className={cx(className, s.h3)} {...props}>
                {children}
              </h3>
            );
          },
          h4({
            node, className, children, ...props
          }) {
            return (
              <h4 className={cx(className, s.h4)} {...props}>
                {children}
              </h4>
            );
          },
          h5({
            node, className, children, ...props
          }) {
            return (
              <h5 className={cx(className, s.h5)} {...props}>
                {children}
              </h5>
            );
          },
          h6({
            node, className, children, ...props
          }) {
            return (
              <h6 className={cx(className, s.h6)} {...props}>
                {children}
              </h6>
            );
          },
          pre({
            node, className, children, ...props
          }) {
            return (
              <pre className={cx(className, s.pre)} {...props}>
                {children}
              </pre>
            );
          },
          code({
            node, inline, className, children, ...props
          }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                PreTag="div"
              >
                {children}
              </SyntaxHighlighter>
            ) : (
              <code className={cx(className, s.code)} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {remark}

      </ReactMarkdown>

    </div>
  );
};
