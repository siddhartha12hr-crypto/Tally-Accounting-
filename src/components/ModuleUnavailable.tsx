import { Link } from "@tanstack/react-router";
import { EyeOff } from "lucide-react";

export function ModuleUnavailable({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <EyeOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-black">{name} is currently unavailable</h1>
        <p className="text-sm text-muted-foreground mt-2">This module has been temporarily hidden by the administrator.</p>
        <Link to="/" className="inline-flex mt-6 rounded-full gradient-hero px-5 py-2.5 text-sm font-bold text-white">Back to Home</Link>
      </div>
    </div>
  );
}
