import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router";
import { useQueryClient } from "@tanstack/react-query";


export default function App() {
  const queryClient = useQueryClient();

  return (
    <RouterProvider
      router={router}
      context={{
        queryClient,
        auth: { user: null }
      }}
    />
  );
}