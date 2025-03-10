import { Suspense } from "react";
import Loading from "../../components/Loading";
import UseCards from "../../components/UseCards";

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <UseCards />
    </Suspense>
  );
}

export default page;