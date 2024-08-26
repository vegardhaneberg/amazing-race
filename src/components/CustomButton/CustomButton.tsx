import React from "react";
import "./CustomButton.css";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "moveOn" | "initial";
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const CustomButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}) => {
  const width = variant == "danger" ? "auto" : "";
  return (
    <button
      className={`custom-button ${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={{ width: width }}
      type={type}
    >
      {label}
    </button>
  );
};

export default CustomButton;
