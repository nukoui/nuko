import type { ComponentProps } from "react";
import { Button } from "@nuco/react";
import { useLocation, useNavigate } from "@tanstack/react-router";

export const LinkButton = ({ href, onClick, variant, width, target, disabled, children }: ComponentProps<typeof Button>) => {
  const location = useLocation();
  const navigate = useNavigate({ from: location.pathname as any });

  const handleClick = (e: Parameters<NonNullable<typeof onClick>>[0]) => {
    onClick?.(e);

    if (disabled)
      return;

    e.preventDefault();
    navigate({ to: href });
  };

  return (
    <Button
      type="anchor"
      href={href}
      disabled={disabled}
      variant={variant}
      width={width}
      target={target}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};
