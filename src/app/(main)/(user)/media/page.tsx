import { MediaCollection } from './_components/media-collection';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Management",
  description: "Managing your media for content creation.",
};

export default function MediaPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="font-heading text-3xl">Media Management</h2>
        <p className="text-muted-foreground">
          Managing your media for content creation.
        </p>
        <MediaCollection />
      </div>
    </>
  );
}
