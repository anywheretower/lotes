import LotMap from "@/components/LotMap";
import Legend from "@/components/Legend";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Proyecto Lotes Lago
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Haz clic en un lote para ver sus características
          </p>
        </div>
      </header>

      {/* Legend */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <Legend />
        </div>
      </div>

      {/* Map */}
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">
          <LotMap />
        </div>
      </div>
    </main>
  );
}
