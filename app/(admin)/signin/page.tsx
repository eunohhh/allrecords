import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLoginButton } from "@/features/admin";
import { getUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";

async function SignInPage() {
  const user = await getUser();

  const isAdmin =
    user?.email === process.env.ADMIN_EMAIL_1 ||
    user?.email === process.env.ADMIN_EMAIL_2;

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
