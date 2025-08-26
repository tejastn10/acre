import Link from "next/link";
import type { FC } from "react";

const NotFound: FC = () => {
	return (
		<div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
			<h1 className="text-6xl font-bold mb-4">404</h1>
			<p className="text-lg text-muted-foreground mb-8">
				Page Not Found. The page you&apos;re looking for doesn&apos;t exist.
			</p>
			<Link href="/">Go Home</Link>
		</div>
	);
};

export default NotFound;
