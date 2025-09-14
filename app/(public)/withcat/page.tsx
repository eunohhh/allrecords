import { Metadata } from "next";
import WithCatTemplate from "@/templates/withcat-template";

export const metadata: Metadata = {
  title: "WithCat",
  description: "고양이 돌보미 안내",
};

function WithCatPage() {
  return <WithCatTemplate />;
}

export default WithCatPage;
