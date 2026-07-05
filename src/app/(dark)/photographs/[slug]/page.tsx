import {
  WorkCataloguePage,
  workMetadata,
  workRoomParams,
} from "@/components/presentation/work-room";

export const dynamicParams = false;

export function generateStaticParams() {
  return workRoomParams("photographs");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return workMetadata("photographs", (await params).slug);
}

export default async function Photograph({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <WorkCataloguePage room="photographs" slug={(await params).slug} />;
}
