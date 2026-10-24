import type { Metadata } from "next";
import OverviewFlow from "./OverviewFlow";

export const metadata: Metadata = {
  title: "Interactive Project Overview | Farmart",
  description: "Explore Farmart pages, live UI previews, and component connections with React Flow.",
};

export default function OverviewPage() {
  return <OverviewFlow />;
}
