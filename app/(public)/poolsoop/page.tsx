import { Metadata } from "next";
import PoolsoopTemplate from "@/templates/poolsoop-template";

export const metadata: Metadata = {
  title: "Poolsoop",
  description: "고양이 관찰일기",
};

function PoolsOopPage() {
  return <PoolsoopTemplate />;
}

export default PoolsOopPage;
