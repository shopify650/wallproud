import { SkeletonLoader } from "@/components/dashboard/SkeletonLoader";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl">
      <SkeletonLoader />
    </div>
  );
}
