import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "flex w-full h-15 p-2 flex-col justify-center items-center gap-2 border-t border-[#D5D7DA] bg-white",
        className,
      )}
    >
      <div className="text-xs font-normal text-[#535862] leading-6 text-center">
        © 2025 Web Programming Hack Blog All rights reserved.
      </div>
    </footer>
  );
}
