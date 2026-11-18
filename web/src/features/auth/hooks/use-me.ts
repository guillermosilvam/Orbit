import { useQuery } from "@tanstack/react-query";
import { meQueryOptions } from "../api/me-query";

/**
 * Hook que devuelve el user autenticado (o null si no hay sesión).
 * Es un wrapper sobre `meQueryOptions`: la lógica vive en un solo lugar.
 *
 */
export function useMe() {
  return useQuery(meQueryOptions);
}