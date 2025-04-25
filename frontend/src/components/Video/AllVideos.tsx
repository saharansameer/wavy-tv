import React from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VideoCard } from "@/components";
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

const getVideos = async ({ pageParam }: { pageParam: number }) => {
  const response = await axios.get(`/api/v1/video?page=${pageParam}&limit=2`);
  return response.data.data;
};

export function AllVideos() {
  const [currPage, setCurrPage] = React.useState(1);
  const {
    data: videos,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.hasPreviousPage ? firstPage.page - 1 : undefined;
    },
  });

  const isPageFetched = (pageNumber: number) => {
    return !!videos?.pageParams.find((page) => page === pageNumber);
  };

  console.log(videos);

  if (isError) {
    return <div>{error.message}</div>;
  }

  if (isFetching || isFetchingNextPage || isLoading) {
    return <div>Fetching...</div>;
  }

  return (
    <div className="w-full h-screen">
      <div className="flex flex-wrap gap-20">
        {videos?.pages?.[currPage - 1]?.docs.map((doc) => (
          <VideoCard key={doc.publicId} video={doc} />
        ))}
      </div>

      <div>
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
