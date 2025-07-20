import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center gap-6 bg-muted p-6 mt-8 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  );
}
