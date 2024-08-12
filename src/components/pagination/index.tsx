import { ChevronRight, ChevronLeft } from "react-feather";
import { usePagination } from "../../utils";

interface props {
	currentPage: any,
    onChangePage: any,
    pageSize: any,
    siblingCount: any,
    totalCount: any
}

export const Pagination = ({
    currentPage = 1,
    onChangePage,
    pageSize,
    siblingCount = 1,
    totalCount
}: props) => {

    const paginationRange: any = usePagination(
        currentPage,
        pageSize,
        siblingCount,
        totalCount
    );

    const onNext = () => {
        onChangePage(currentPage + 1);
    }

    const onPrevious = () => {
        if ((currentPage - 1) === 0) {
            onChangePage(1);
        } else {
            onChangePage(currentPage - 1);
        }
    }

    return (
        <div className="w-full flex items-center justify-end px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPrevious()}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onNext()}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
                <div>
                <nav className="isolate gap-2 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button onClick={() => currentPage !== 1 ? onPrevious() : false } className="relative cursor-pointer inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
                        <span className="sr-only">Previous</span>
						<ChevronLeft />
                    </button>

                    {
                        paginationRange.map((range: any) => {
                            if (range === '...') {
                                return (
                                    <button key={range} className="relative cursor-pointer inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                                        ...
                                    </button>
                                )
                            }

                            return range === currentPage ? (
                                <button
                                    key={range}
                                    onClick={() => onChangePage(range)}
                                    aria-current="page"
                                    className="relative cursor-pointer z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20"
                                >
                                    {range}
                                </button>
                            ) : (
                                <button
                                    key={range}
                                    onClick={() => onChangePage(range)}
                                    className="relative cursor-pointer inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                                >
                                    {range}
                                </button>
                            )
                        })
                    }
                    <button onClick={() => paginationRange[paginationRange.length - 1] !== currentPage ? onNext() : false} className="relative cursor-pointer inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20">
                        <span className="sr-only">Next</span>
                        <ChevronRight />
                    </button>
                </nav>
                </div>
            </div>
        </div>
    )
}
