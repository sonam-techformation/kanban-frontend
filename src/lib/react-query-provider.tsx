// ReactQueryProvider.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import queryClient from "./react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
