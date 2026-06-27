import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/balance-sheet")({
  beforeLoad: () => {
    throw redirect({ to: "/note/$noteId", params: { noteId: "3" } });
  },
  component: () => null,
});
