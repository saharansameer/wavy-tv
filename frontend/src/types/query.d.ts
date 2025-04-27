/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryFunctionContext } from "@tanstack/react-query";

declare global {
  interface PaginatedResponse {
    docs: any[];
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number | null;
    page: number;
    pagingCounter: number;
    totalDocs: number;
    totalPages: number;
  }

  type InfiniteQueryFunction = (
    context: QueryFunctionContext<readonly [string], number>
  ) => Promise<PaginatedResponse>;
}

export {};
