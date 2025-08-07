"use client";
import { useRouter } from "next/navigation";
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
import { Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { useLogin } from "@/lib/hooks/auth/useLogin";
import { useToast } from "@/lib/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mutateAsync: loginUser } = useLogin();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login...");
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      console.log("Login result:", result);

      if (result?.user) {
        console.log("Dispatching user to Redux:", result.user);
        dispatch(setUser(result.user));

        toast({
          title: "Success! 🎉",
          description: result.message || "Login successful",
        });

        // Navigate after a short delay to ensure state is updated
        setTimeout(() => {
          router.push("/");
        }, 100);
      } else {
        const errorMessage = result?.message || "Invalid email or password";
        setError(errorMessage);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      let errorMessage = "An unexpected error occurred";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        // Handle rate limiting error (429)
        if (error.response?.status === 429 && responseData) {
          if (responseData.error && responseData.retryAfter) {
            errorMessage = `${responseData.error}. Please try again in ${responseData.retryAfter}.`;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          }
        }
        // Handle other errors
        else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 mt-10", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter your email"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Enter your password"
                />
              </div>

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

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
