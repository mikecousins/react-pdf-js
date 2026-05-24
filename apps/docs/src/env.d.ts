/// <reference types="astro/client" />

declare module 'virtual:search' {
  import type { SearchOptions } from 'flexsearch';

  export type Result = {
    url: string;
    title: string;
    pageTitle?: string;
  };

  export function search(query: string, options?: SearchOptions): Array<Result>;
}
