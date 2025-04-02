import React, { ReactNode } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  text?: string;
  className?: string;
  icon?: ReactNode;
  isDisabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  text,
  className = "bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline",
  icon,
  isDisabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={isDisabled}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span>{icon}</span>}
        {text && <span>{text}</span>}
      </div>
    </button>
  );
};

export default Button;
