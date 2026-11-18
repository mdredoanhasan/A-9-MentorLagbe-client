import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";

type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root>;
type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;
type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback>;

function Avatar({ className = "", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={`relative flex size-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    />
  );
}

function AvatarImage({ className = "", ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={`aspect-square size-full ${className}`}
      {...props}
    />
  );
}

function AvatarFallback({ className = "", ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={`flex size-full items-center justify-center rounded-full bg-[#1e2a78] font-semibold text-white ${className}`}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
