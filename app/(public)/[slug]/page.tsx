import RecordTemplate from "@/templates/record-template";

interface RecordPageProps {
  params: Promise<{ slug: string }>;
}

async function RecordPage({ params }: RecordPageProps) {
  const { slug } = await params;

  return <RecordTemplate slug={slug} />;
}

export default RecordPage;
