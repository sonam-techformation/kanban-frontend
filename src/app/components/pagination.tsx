"use client";
import { secondaryBgColor } from "@/utils/color";
import { useTheme } from "next-themes";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Button from "./button";

interface PaginationProps {
  totalItems: number;
  limit: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  totalItems,
  limit,
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const { theme } = useTheme();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

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
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(currentPage - half, 1);
      endPage = Math.min(currentPage + half, totalPages);

      if (currentPage <= half + 1) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - maxVisiblePages + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            currentPage === i
              ? "z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : " ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 hover:text-black"
          }`}
          text={`${i}`}
          isDisabled={false}
        />
      );
    }

    return pages;
  };

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200  px-4 py-3 sm:px-6 ${secondaryBgColor(
        theme
      )}`}
    >
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm ">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
          >
            <Button
              onClick={handlePrevious}
              isDisabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              icon={<MdChevronLeft aria-hidden="true" className="size-5" />}
            />

            {renderPageNumbers()}

            <Button
              onClick={handleNext}
              isDisabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              icon={<MdChevronRight aria-hidden="true" className="size-5" />}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};
