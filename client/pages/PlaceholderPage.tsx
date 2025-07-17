import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description = "This page is coming soon. Continue prompting to have this page implemented.",
}: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <Construction className="h-16 w-16 text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground max-w-md">{description}</p>
        </div>
        <Button asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
}
