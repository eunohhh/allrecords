import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/env/t3-env";
import { AdminLoginButton } from "@/features/admin";
import { getUser } from "@/lib/server-utils";

async function SignInPage() {
  const user = await getUser();

  const isAdmin =
    user?.email === env.ADMIN_EMAIL_1 || user?.email === env.ADMIN_EMAIL_2;

  if (user && isAdmin) redirect("/admin");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminLoginButton />
      </CardContent>
    </Card>
  );
}

export default SignInPage;
