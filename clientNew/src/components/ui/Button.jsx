import { forwardRef } from 'react';

const Button = forwardRef(({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-[#106934] text-white hover:bg-[#0d5429] shadow-md',
    outline: 'border-2 border-[#106934] text-[#106934] hover:bg-[#106934] hover:text-white shadow-sm',
    ghost: 'hover:bg-[#106934]/10 text-[#106934]',
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4 text-base',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-12 py-3 px-8 text-lg font-semibold',
  };
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
