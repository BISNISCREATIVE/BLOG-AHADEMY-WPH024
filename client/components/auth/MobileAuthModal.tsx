import React from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MobileAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileAuthModal({ isOpen, onClose }: MobileAuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto p-0 gap-0 bg-white border border-[#E5E7EB] rounded-lg">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 space-y-0 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            {/* Logo Symbol */}
            <div className="relative w-8 h-8">
              <div className="absolute top-0 left-0 w-4 h-4 bg-[#0093DD] transform rotate-45"></div>
              <div className="absolute top-1 left-3 w-4 h-4 bg-[#0093DD] transform rotate-45"></div>
            </div>
            <DialogTitle className="font-semibold text-lg text-[#181D27]">
              Your Logo
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 shrink-0 hover:bg-[#F9FAFB]"
          >
            <X className="h-4 w-4 text-[#374151]" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col items-center justify-center py-8 px-6 space-y-4">
          <Button
            asChild
            variant="ghost"
            className="w-full text-[#0093DD] hover:text-[#0093DD]/80 hover:bg-[#F0F9FF] font-medium text-base py-3"
            onClick={onClose}
          >
            <Link to="/login">Login</Link>
          </Button>

          <Button
            asChild
            className="w-full bg-[#0093DD] hover:bg-[#0074B7] text-white font-medium text-base py-3 rounded-lg"
            onClick={onClose}
          >
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
