import { Suspense } from "react";
import LotMap from "@/components/LotMap";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense>
        <LotMap />
      </Suspense>
    </main>
  );
}
