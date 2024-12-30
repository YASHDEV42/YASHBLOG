"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/server-supabase";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  message: string;
  successful?: boolean;
}

export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const data: LoginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export const signup = async (
  prevState: FormData,
  formState: FormData
): Promise<SignupResponse> => {
  const supabase = await createClient();
  const name = formState.get("name") as string;
  const email = formState.get("email") as string;
  const password = formState.get("password") as string;
  const confirmPassword = formState.get("confirmPassword") as string;
  const userData: SignupData = { name, email, password, confirmPassword };

  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    return { message: "Please fill in all fields" };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match" };
  }

  const { data, error } = await supabase.auth.signUp(userData);
  console.log("data: ", data);
  console.log("error: ", error);
  revalidatePath("/", "layout");
  return {
    message: "Please check your email to verify your account",
    successful: true,
  };
};
