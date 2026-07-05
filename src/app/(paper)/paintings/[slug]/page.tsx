import {
  WorkCataloguePage,
  workMetadata,
  workRoomParams,
} from "@/components/presentation/work-room";

export const dynamicParams = false;

export function generateStaticParams() {
  return workRoomParams("paintings");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return workMetadata("paintings", (await params).slug);
}

export default async function Work({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <WorkCataloguePage room="paintings" slug={(await params).slug} />;
}
