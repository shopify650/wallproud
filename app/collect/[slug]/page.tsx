import { getCollectionRequest } from "@/app/actions/collect";
import CollectForm from "./CollectForm";

export default async function CollectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const request = await getCollectionRequest(slug);

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Link not found</h2>
          <p className="mt-2 text-sm text-gray-500">
            This testimonial collection link doesn&apos;t exist. It may have been removed.
          </p>
        </div>
      </div>
    );
  }

  if (request.expires_at && new Date(request.expires_at) < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50">
            <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Link expired</h2>
          <p className="mt-2 text-sm text-gray-500">
            This collection link has expired. Please ask the sender for a new one.
          </p>
        </div>
      </div>
    );
  }

  if (request.status === "completed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Already submitted</h2>
          <p className="mt-2 text-sm text-gray-500">
            Thanks! You&apos;ve already submitted feedback for this request.
          </p>
        </div>
      </div>
    );
  }

  const workspace = request.workspace;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50 p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl bg-white shadow-xl shadow-indigo-500/5">
          <div className="border-b border-gray-100 px-6 py-6 text-center">
            {workspace?.logo_url && (
              <img
                src={workspace.logo_url}
                alt={workspace.name}
                className="mx-auto mb-3 h-12 w-12 rounded-xl object-cover"
              />
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {workspace?.name || "Share your feedback"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {request.recipient_name
                ? `${workspace?.name || "We"} would love your feedback!`
                : "We'd love your feedback!"}
            </p>
          </div>

          <CollectForm
            token={slug}
            workspaceColor={workspace?.primary_color || "#4f46e5"}
          />
        </div>
      </div>
    </div>
  );
}
