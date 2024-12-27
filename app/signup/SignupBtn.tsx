"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useFormStatus } from "react-dom";

const SignupBtn = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className={`w-full ${pending && "opacity-50"}`}
      disabled={pending}
    >
      {pending ? "Signing up..." : "Sign up"}
    </Button>
  );
};

export default SignupBtn;
