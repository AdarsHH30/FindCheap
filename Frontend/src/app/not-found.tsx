import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-var(--navbar-height,57px))]">
      <div className="space-y-6 text-center max-w-md">
        <h1 className="text-7xl font-extrabold tracking-tighter scroll-m-20 lg:text-9xl">
          404
        </h1>
        <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="default" className="mt-4">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
