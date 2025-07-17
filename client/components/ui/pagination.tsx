import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current, adjacent pages, and ellipsis logic
      if (currentPage <= 2) {
        pages.push(1, 2, 3, "...");
      } else if (currentPage >= totalPages - 1) {
        pages.push("...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1, "...");
      }
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center bg-white py-4",
        className,
      )}
    >
      {/* Previous Button */}
      <Button
        variant="ghost"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="h-auto p-0 hover:bg-transparent disabled:opacity-50 mr-2 md:mr-4"
      >
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="w-6 h-6 text-[#181D27]" />
          <span className="text-xs font-normal text-[#181D27] leading-6">
            Previous
          </span>
        </div>
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center">
        {renderPageNumbers().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <div className="flex w-12 h-12 p-2 flex-col justify-center items-center">
                <span className="text-xs font-normal text-[#181D27] leading-6 text-center">
                  ...
                </span>
              </div>
            ) : page === currentPage ? (
              <div className="flex w-9 h-9 p-1.5 flex-col justify-center items-center rounded-full bg-[#0093DD]">
                <span className="text-[11px] font-normal text-[#FDFDFD] leading-[21px] text-center">
                  {page}
                </span>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onPageChange(page as number)}
                className="w-12 h-12 p-2 hover:bg-transparent"
              >
                <span className="text-xs font-normal text-[#181D27] leading-6 text-center">
                  {page}
                </span>
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-auto p-0 hover:bg-transparent disabled:opacity-50 ml-2 md:ml-4"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-normal text-[#181D27] leading-6">
            Next
          </span>
          <ChevronRight className="w-6 h-6 text-[#181D27]" />
        </div>
      </Button>
    </div>
  );
}
