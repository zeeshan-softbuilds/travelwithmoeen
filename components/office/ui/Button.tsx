import type { ButtonHTMLAttributes, Ref } from "react";
import { Icon, type IconName } from "@/components/office/ui/Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonLook = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  block?: boolean;
  className?: string;
};

// The class list for a button, so a Link can look like a Button.
export function buttonClass({ variant = "secondary", size = "md", iconOnly = false, block = false, className = "" }: ButtonLook = {}) {
  const parts = ["btn", `btn-${variant}`];
  if (size !== "md") parts.push(`btn-${size}`);
  if (iconOnly) parts.push("btn-icon");
  if (block) parts.push("btn-block");
  if (className) parts.push(className);
  return parts.join(" ");
}

type ButtonProps = ButtonLook &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    icon?: IconName;
    busy?: boolean;
    ref?: Ref<HTMLButtonElement>;
  };

export function Button({ variant, size, iconOnly, block, className, icon, busy = false, type = "button", children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={buttonClass({ variant, size, iconOnly, block, className })}
      type={type}
      aria-busy={busy || undefined}
    >
      {icon && !busy ? <Icon name={icon} /> : null}
      {children}
    </button>
  );
}
