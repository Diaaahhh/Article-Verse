import { Suspense } from "react";
import AddPostPageClient from "./AddPostPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPostPageClient />
    </Suspense>
  );
}