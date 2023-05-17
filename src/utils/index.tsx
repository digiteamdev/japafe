import { useMemo } from "react"
const currentYear = (new Date()).getFullYear();
const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

export const GetListYear = () => {
    return [...range(currentYear, currentYear - 50, -1).map(value => {
        return {
            id: value,
            name: value,
        }
    })];
}

export const formatRupiah = (angka: any) => {
    let number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if(ribuan){
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
}



const rangePage = (start: any, end: any) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = (
    currentPage: any,
    pageSize: any,
    siblingCount: any = 1,
    totalCount: any
) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize);
    
        const totalPageNumbers = siblingCount + 5;
        if (totalPageNumbers >= totalPageCount) {
            return rangePage(1, totalPageCount);
        }
        
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    
        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;
    
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = rangePage(1, leftItemCount);
        
            return [...leftRange, '...', totalPageCount];
        }
    
        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
                let rightRange = rangePage(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = rangePage(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }
    },[totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
}