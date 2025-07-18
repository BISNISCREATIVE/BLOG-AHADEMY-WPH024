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
      <DialogContent className="max-w-sm mx-auto p-0 gap-0 bg-white">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 space-y-0">
          <div className="flex items-center gap-2">
            {/* Logo Symbol */}
            <div className="relative w-8 h-8">
              <svg
                className="absolute top-0 left-0"
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
              >
                <path
                  d="M13.0645 4.96143L4.70703 7.81592V15.521L0 17.1284V4.63916L13.0645 0.179199V4.96143Z"
                  fill="#0093DD"
                />
              </svg>
              <svg
                className="absolute top-1 left-2"
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.660156 4.98725L13.7248 0.526894V13.0159L0.660156 17.4762V4.98725Z"
                  fill="#0093DD"
                />
              </svg>
            </div>
            <DialogTitle className="font-semibold text-lg text-foreground">
              Your Logo
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <div className="flex flex-col items-center justify-center py-16 px-6 space-y-4">
          <Button
            asChild
            variant="ghost"
            className="w-full text-[#0093DD] hover:text-[#0093DD]/80 font-medium text-base"
            onClick={onClose}
          >
            <Link to="/login">Login</Link>
          </Button>

          <Button
            asChild
            className="w-full bg-[#0093DD] hover:bg-[#0093DD]/90 text-white font-medium text-base py-3"
            onClick={onClose}
          >
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
