import React from 'react';

export interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'ghost' | 'danger';
  children: React.ReactNode;
}

export const Btn: React.FC<BtnProps> = ({ children, variant = 'default', className = '', ...props }) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};
