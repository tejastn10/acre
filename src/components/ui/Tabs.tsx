"use client";

import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";

import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";

import { cx } from "@/utils/tailwind";

const Tabs = Root;

const TabsList = forwardRef<ComponentRef<typeof List>, ComponentPropsWithoutRef<typeof List>>(
	({ className, ...props }, ref) => (
		<List
			ref={ref}
			className={cx(
				"inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
				className
			)}
			{...props}
		/>
	)
);
TabsList.displayName = List.displayName;

const TabsTrigger = forwardRef<
	ComponentRef<typeof Trigger>,
	ComponentPropsWithoutRef<typeof Trigger>
>(({ className, ...props }, ref) => (
	<Trigger
		ref={ref}
		className={cx(
			"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
			className
		)}
		{...props}
	/>
));
TabsTrigger.displayName = Trigger.displayName;

const TabsContent = forwardRef<
	ComponentRef<typeof Content>,
	ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
	<Content
		ref={ref}
		className={cx(
			"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className
		)}
		{...props}
	/>
));
TabsContent.displayName = Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
