import { RouterProvider } from "@tanstack/react-router";
import { router } from "./app/router";
import { useMe } from "./features/auth/hooks/use-me";


export default function App() {
  const me = useMe();

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          user: me.data ?? null,
        },
      }}
    />
  );
}