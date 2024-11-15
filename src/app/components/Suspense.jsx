import { Suspense } from "react";
import { Loading } from "app/components";

export default function MainSuspense({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
