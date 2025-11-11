import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const PaginationControls = ({ pagination, onPageChange, onLimitChange, limit, isLoading }) => {
    const { page, totalPages } = pagination;

    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Hàng/trang:</span>
                <Select
                    value={String(limit)}
                    onValueChange={(value) => onLimitChange(Number(value))}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 20, 50, 100].map((pageSize) => (
                            <SelectItem key={pageSize} value={String(pageSize)}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                    Trang {page} của {totalPages}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onPageChange(1)}
                        disabled={page === 1 || isLoading}
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onPageChange(Math.max(page - 1, 1))}
                        disabled={page === 1 || isLoading}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                        disabled={page === totalPages || isLoading}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => onPageChange(totalPages)}
                        disabled={page === totalPages || isLoading}
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PaginationControls;