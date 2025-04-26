/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui";

interface PaginatedListProps {
  queryKey: [string];
  queryFn: QueryFunction;
  renderItem: (item: any) => React.ReactNode;
  mainDivCN?: string;
  docDivCN?: string;
  pageDivCN?: string;
}

export function PaginatedList({
  queryKey,
  queryFn,
  renderItem,
  mainDivCN,
  docDivCN,
  pageDivCN,
}: PaginatedListProps) {
  const [currPage, setCurrPage] = React.useState(1);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPrevPage ? firstPage.page - 1 : undefined;
    },
  });

  const isPageFetched = (pageNumber: number) =>
    !!data?.pageParams.find((page) => page === pageNumber);

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isFetching || isFetchingNextPage || isLoading) {
    return <div>Fetching...</div>;
  }

  return (
    <div
      className={
        mainDivCN || "flex flex-col justify-between w-full h-full px-5 py-5"
      }
    >
      <div
        className={
          docDivCN || "flex flex-wrap justify-center gap-x-20 gap-y-10"
        }
      >
        {data?.pages?.[currPage - 1]?.docs.map((item: any) => renderItem(item))}
      </div>

      <div className={pageDivCN || "pt-10"}>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer select-none"
                onClick={() => {
                  if (currPage > 1) {
                    setCurrPage((prev) => prev - 1);
                  }
                }}
              />
            </PaginationItem>

            {currPage === 1 ? (
              <></>
            ) : (
              <>
                <PaginationItem>
                  <PaginationLink
                    className="cursor-pointer select-none"
                    onClick={() => setCurrPage(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationLink className="cursor-pointer select-none">
                <Button variant={"secondary"}>{currPage}</Button>
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className="cursor-pointer select-none"
                onClick={() => {
                  if (hasNextPage) {
                    fetchNextPage();
                    setCurrPage((prev) => prev + 1);
                  }
                  if (isPageFetched(currPage + 1)) {
                    setCurrPage((prev) => prev + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
