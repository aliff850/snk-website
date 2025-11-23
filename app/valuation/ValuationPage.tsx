// app/valuation/ValuationPage.tsx (client)
"use client";

import { ValuationLayout } from "../components/valuation/valuation/Valuation";

export default function ValuationPage() {
  return (
    <section className="w-full min-h-screen bg-fixed bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
      <ValuationLayout />
    </section>
  );
}