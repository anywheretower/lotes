import { Suspense } from "react";
import LotMap from "@/components/LotMap";

export default function Home() {
  return (
    <main className="lg:h-screen lg:overflow-hidden bg-white">
      <Suspense>
        <LotMap />
      </Suspense>
    </main>
  );
}
