"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

type ContentProps = ComponentProps<typeof DropdownMenuPrimitive.Content>;
type LabelProps = ComponentProps<typeof DropdownMenuPrimitive.Label>;
type SeparatorProps = ComponentProps<typeof DropdownMenuPrimitive.Separator>;
type ItemProps = ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  variant?: "default" | "danger";
};

function DropdownMenuContent({
  className = "",
  sideOffset = 10,
  ...props
}: ContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align="end"
        sideOffset={sideOffset}
        className={`z-50 min-w-60 overflow-hidden rounded-2xl border border-[#e3e5f5] bg-white p-2 text-[#101535] shadow-xl shadow-[#1e2a78]/15 outline-none ${className}`}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuLabel({ className = "", ...props }: LabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={`rounded-xl bg-[#e8eafb] px-3 py-3 text-sm font-semibold text-[#101535] ${className}`}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className = "", ...props }: SeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={`-mx-2 my-2 h-px bg-[#e3e5f5] ${className}`}
      {...props}
    />
  );
}

const itemBase =
  "relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const itemVariants = {
  default:
    "text-[#101535] focus:bg-[#1e2a78] focus:text-white data-[highlighted]:bg-[#1e2a78] data-[highlighted]:text-white",
  danger:
    "text-red-600 focus:bg-red-50 focus:text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600",
};

function DropdownMenuItem({
  className = "",
  variant = "default",
  ...props
}: ItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={`${itemBase} ${itemVariants[variant]} ${className}`}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};