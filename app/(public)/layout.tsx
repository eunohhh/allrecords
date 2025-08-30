import { PropsWithChildren } from "react";

function PublicLayout({ children }: PropsWithChildren) {
  return <main className="flex flex-col p-10">{children}</main>;
}

export default PublicLayout;
