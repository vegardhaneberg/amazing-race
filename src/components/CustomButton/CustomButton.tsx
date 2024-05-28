import React from "react";
import "./CustomButton.css";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "moveOn" | "initial";
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled,
}) => {
  const width = variant == "danger" ? "auto" : "";
  return (
    <button
      className={`custom-button ${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={{ width: width }}
    >
      {label}
    </button>
  );
};

export default CustomButton;
