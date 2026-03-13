import React from 'react';
import { cn } from '../../../utils/cn';

interface ButtonGroupProps {
  children: React.ReactNode;
  variant?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'xs' | 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Button Group Component - Groups multiple buttons together
 * @param variant - Layout direction (default: 'horizontal')
 * @param spacing - Space between buttons (default: 'sm')
 * @param fullWidth - Make group full width
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  variant = 'horizontal',
  spacing = 'sm',
  fullWidth = false,
  className,
}) => {
  const spacingStyles = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
  };

  const variantStyles = {
    horizontal: 'flex flex-row flex-wrap items-center',
    vertical: 'flex flex-col items-stretch',
  };

  return (
    <div
      className={cn(
        variantStyles[variant],
        spacingStyles[spacing],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ButtonGroup;
