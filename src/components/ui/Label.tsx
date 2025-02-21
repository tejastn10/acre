"use client";

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";

import { Root } from "@radix-ui/react-label";

import { cva, type VariantProps } from "class-variance-authority";

import { cx } from "@/utils/tailwind";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = forwardRef<
	ComponentRef<typeof Root>,
	ComponentPropsWithoutRef<typeof Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
	<Root ref={ref} className={cx(labelVariants(), className)} {...props} />
));
Label.displayName = Root.displayName;

export { Label };
