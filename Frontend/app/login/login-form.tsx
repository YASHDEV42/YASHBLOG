"use client";
import { useRouter } from "next/navigation"; // Import useRouter
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "@/actions/User";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

type LoginInitialState = {
  message: string | null;
};
const initialState: LoginInitialState = {
  message: null,
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, initialState);

  if (state?.message === "Success") {
    router.push("/");
  }

  return (
    <div className={cn("flex flex-col gap-6 mt-10", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              {state?.message && state.message !== "Success" && (
                <p className="text-red-700">{state.message}</p>
              )}
              {isPending ? (
                <Button className="w-full opacity-50" type="submit" disabled>
                  Login <Loader2 className="inline animate-spin" />
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  Login
                </Button>
              )}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
