import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "../api/me-query";


export function useMe() {
  return useQuery(meQueryOptions);
}