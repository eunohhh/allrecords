import type { PropsWithChildren } from "react";

function SignInLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex h-svh w-full items-center justify-center">
      {children}
    </main>
  );
}

export default SignInLayout;
