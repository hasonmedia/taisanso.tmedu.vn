import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getSuppliers } from '@/apis/supplier';

const SupplierSelect = ({ value, onValueChange, placeholder = "Chọn nhà cung cấp", danhMucId = null }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, [danhMucId]);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const filter = danhMucId ? [danhMucId] : [];
            const response = await getSuppliers(filter);
            setSuppliers(response);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors">
                <SelectValue placeholder={loading ? "Đang tải..." : placeholder} />
            </SelectTrigger>
            <SelectContent>
                {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.ten_nha_cung_cap || supplier.ten}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SupplierSelect;