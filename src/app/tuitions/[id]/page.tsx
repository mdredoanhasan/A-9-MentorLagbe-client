import { Suspense } from "react";
import TuitionDetails, { TuitionDetailsSkeleton } from "./TuitionDetails";

type TuitionPageProps = {
  params: Promise<{ id: string }>;
};

export default function TuitionDetailsPage({ params }: TuitionPageProps) {
  return (
    <Suspense fallback={<TuitionDetailsSkeleton />}>
      {params.then(({ id }) => (
        <TuitionDetails key={id} tuitionId={id} />
      ))}
    </Suspense>
  );
}
