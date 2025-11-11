import React from 'react'
import { Button } from './ui/button';
import { Check, X } from 'lucide-react';

const RequestActions = ({ item, onApprove, onReject }) => (
    <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-stretch space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-0 lg:space-y-3">
        {/* Header - Hidden on mobile in horizontal layout */}
        <div className="text-center mb-2 sm:hidden lg:block">
            <span className="text-base sm:text-lg text-gray-500 font-medium">Thao tác</span>
        </div>

        {/* Approve Button */}
        <Button
            onClick={() => onApprove(item)}
            className="w-full sm:flex-1 lg:w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-2.5 px-4 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            size="default"
        >
            <Check className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Phê Duyệt</span>
        </Button>

        {/* Reject Button */}
        <Button
            onClick={() => onReject(item)}
            variant="destructive"
            className="w-full sm:flex-1 lg:w-full font-medium py-2.5 px-4 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700"
            size="default"
        >
            <X className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Từ Chối</span>
        </Button>

        {/* Alternative compact version for very small screens */}
        <div className="sm:hidden">
            <div className="flex space-x-2 mt-2">
                <Button
                    onClick={() => onApprove(item)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white p-2 min-w-0"
                    size="sm"
                >
                    <Check className="w-4 h-4" />
                    <span className="ml-1 text-xs">Duyệt</span>
                </Button>
                <Button
                    onClick={() => onReject(item)}
                    variant="destructive"
                    className="flex-1 p-2 min-w-0"
                    size="sm"
                >
                    <X className="w-4 h-4" />
                    <span className="ml-1 text-xs">Từ chối</span>
                </Button>
            </div>
        </div>
    </div>
);

// Version alternative avec menu dropdown pour les espaces très restreints
export const CompactRequestActions = ({ item, onApprove, onReject }) => (
    <div className="relative">
        <div className="flex space-x-1">
            <Button
                onClick={() => onApprove(item)}
                className="bg-green-600 hover:bg-green-700 text-white p-2"
                size="sm"
            >
                <Check className="w-4 h-4" />
            </Button>
            <Button
                onClick={() => onReject(item)}
                variant="destructive"
                className="p-2"
                size="sm"
            >
                <X className="w-4 h-4" />
            </Button>
        </div>
    </div>
);

export default RequestActions;