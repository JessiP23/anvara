import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';
type TextVariant = 'body' | 'body-sm' | 'caption' | 'overline' | 'label';

interface HeadingProps {
  as?: HeadingLevel;
  children: ReactNode;
  className?: string;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: 'text-2xl font-bold tracking-tight sm:text-3xl',
  h2: 'text-xl font-semibold tracking-tight sm:text-2xl',
  h3: 'text-lg font-semibold',
  h4: 'text-base font-medium',
};

export function Heading({ as: Tag = 'h1', children, className }: HeadingProps) {
  return (
    <Tag className={cn(headingStyles[Tag], 'text-[--color-foreground]', className)}>
      {children}
    </Tag>
  );
}

interface TextProps {
  variant?: TextVariant;
  muted?: boolean;
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

const textStyles: Record<TextVariant, string> = {
  body: 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-relaxed',
  caption: 'text-xs',
  overline: 'text-xs font-medium uppercase tracking-[0.15em]',
  label: 'text-sm font-medium',
};

export function Text({ variant = 'body', muted = false, children, className, as: Tag = 'p' }: TextProps) {
  return (
    <Tag
      className={cn(
        textStyles[variant],
        muted ? 'text-[--color-muted]' : 'text-[--color-foreground]',
        className
      )}
    >
      {children}
    </Tag>
  );
}

// Page header component for consistent page titles
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Heading as="h1">{title}</Heading>
        {description && (
          <Text variant="body-sm" muted className="mt-1">
            {description}
          </Text>
        )}
      </div>
      {action && <div className="mt-3 sm:mt-0">{action}</div>}
    </div>
  );
}

// Section header for dashboard sections
interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading as="h2" className="text-lg">
          {title}
        </Heading>
        {description && (
          <Text variant="caption" muted>
            {description}
          </Text>
        )}
      </div>
      {action}
    </div>
  );
}