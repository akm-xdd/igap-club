import { highlight } from 'sugar-high';
import Image from 'next/image';
import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { CopyCodeButton } from '@/components/copy-code-button';

function Code({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) {
  // Fenced code blocks get a `language-xxx` className from MDX; inline `code` doesn't.
  // Only highlight block code - sugar-high's palette is tuned for the dark <pre> background
  // and reads as invisible against the light inline-code pill.
  const isBlock = typeof className === 'string' && className.startsWith('language-');

  if (!isBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const raw = typeof children === 'string' ? children : '';
  const codeHTML = highlight(raw);
  return (
    <code
      className={className}
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
  );
}

function getCodeElementProps(children: ReactNode): { raw: string; lang: string } {
  const child = Children.only(children);
  if (!isValidElement(child)) return { raw: '', lang: '' };

  const props = child.props as { children?: unknown; className?: unknown };
  const raw = typeof props.children === 'string' ? props.children : '';
  const className = typeof props.className === 'string' ? props.className : '';
  const lang = className.replace('language-', '');
  return { raw, lang };
}

function Pre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const { raw, lang } = getCodeElementProps(children);

  return (
    <div className="group relative">
      {lang && (
        <span className="pointer-events-none absolute right-11 top-2 select-none font-mono text-xs text-white/40">
          {lang}
        </span>
      )}
      {raw && <CopyCodeButton text={raw} />}
      <pre {...props}>{children}</pre>
    </div>
  );
}

function Img({ src, alt }: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string') return null;

  return (
    <span className="relative my-6 block aspect-video overflow-hidden rounded-lg border-2 border-black">
      <Image
        src={src}
        alt={alt ?? ''}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 768px, 100vw"
      />
    </span>
  );
}

export const mdxComponents = {
  code: Code,
  pre: Pre,
  img: Img,
};
