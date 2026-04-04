interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className = '' }: IconProps) => {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
};