import UploadClient from "./UploadClient";

interface UploadPageProps {
  searchParams: Promise<{
    orderId?: string;
    email?: string;
  }>;
}

export default async function MixMasterUploadPage({
  searchParams,
}: UploadPageProps) {
  const params = await searchParams;

  return (
    <UploadClient
      initialOrderId={params.orderId ?? ""}
      initialEmail={params.email ?? ""}
    />
  );
}