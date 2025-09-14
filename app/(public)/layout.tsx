import { PropsWithChildren } from "react";
import { MainWrapper } from "@/features/home";

function PublicLayout({ children }: PropsWithChildren) {
  return <MainWrapper>{children}</MainWrapper>;
}

export default PublicLayout;
