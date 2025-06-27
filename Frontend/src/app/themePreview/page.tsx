import React from "react";
import { Button } from "@/components/ui/button";

export default function ThemePreviewPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 space-y-8 bg-background text-foreground font-sans">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold text-primary">
          Welcome to Your Teal Theme
        </h1>
        <p className="text-muted-foreground text-lg">
          This is a live preview of your OKLCH-based design system powered by
          Tailwind, ShadCN, and Inter.
        </p>
      </div>

      <div className="flex gap-4">
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm text-center mt-10">
        <div className="p-4 bg-primary text-primary-foreground">bg-primary</div>
        <div className="p-4 bg-secondary text-secondary-foreground">
          bg-secondary
        </div>
        <div className="p-4 bg-accent text-accent-foreground">bg-accent</div>
        <div className="p-4 bg-muted text-muted-foreground">bg-muted</div>
        <div className="p-4 bg-popover text-popover-foreground">bg-popover</div>
        <div className="p-4 bg-destructive text-white">bg-destructive</div>
      </div>
    </div>
  );
}
