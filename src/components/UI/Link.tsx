import React from 'react';
import { useRouter } from '../../hooks/useRouter';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  state?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({
  to,
  replace,
  state,
  className,
  children,
  onClick,
  ...rest
}) => {
  const { navigateTo } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }

    if (!e.defaultPrevented) {
      navigateTo(to, { replace, state });
    }
  };

  return (
    <a
      href={to}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link;
