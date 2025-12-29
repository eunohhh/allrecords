import { Metadata } from "next";
import BoardTemplate from "@/templates/board-template";

export const metadata: Metadata = {
  title: "Board",
  description: "연락 게시판",
};

function BoardPage() {
  return <BoardTemplate />;
}

export default BoardPage;
