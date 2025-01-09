import { Suspense } from "react";
import Loading from "../../components/client/Loading";
import ListVertical from '../../components/client/ListVertical';

// Forzar que la página se renderice dinámicamente en lugar de usar SSG
export const dynamic = 'force-dynamic';

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ListVertical />
    </Suspense>
  )
}

export default page