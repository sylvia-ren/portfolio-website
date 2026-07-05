import {
  WorkCataloguePage,
  workMetadata,
  workRoomParams,
} from "@/components/presentation/work-room";

export const dynamicParams = false;

export function generateStaticParams() {
  return workRoomParams("sketchbooks");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return workMetadata("sketchbooks", (await params).slug);
}

export default async function Work({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <WorkCataloguePage room="sketchbooks" slug={(await params).slug} />;
}
