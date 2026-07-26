import { Suspense } from "react";
import NewCityForm from "./NewCityForm";

export default function NewCityPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
      <NewCityForm />
    </Suspense>
  );
}
