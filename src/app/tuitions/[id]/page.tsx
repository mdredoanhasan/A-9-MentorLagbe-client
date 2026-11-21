import { Suspense } from "react";
import TuitionDetails, { TuitionDetailsSkeleton } from "./TuitionDetails";
import { BookmarkProvider } from "@/app/components/bookmark-controls";

type TuitionPageProps = {
  params: Promise<{ id: string }>;
};

export default function TuitionDetailsPage({ params }: TuitionPageProps) {
  return (
    <Suspense fallback={<TuitionDetailsSkeleton />}>
      {params.then(({ id }) => (
        <BookmarkProvider>
          <TuitionDetails key={id} tuitionId={id} />
        </BookmarkProvider>
      ))}
    </Suspense>
  );
}
