import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--black-rich)" }}
        >
          <div className="spinner"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}