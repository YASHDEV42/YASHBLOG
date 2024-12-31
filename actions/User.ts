"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/server-supabase";

interface LoginData {
  email: string;
  password: string;
}
type LoginInitialState = {
  message: string | null;
};
interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  message: string;
  successful: boolean;
}
interface LoginResponse {
  message: string;
}

type InitialState = {
  message: string | null;
  successful: boolean;
};

export async function login(
  prevState: LoginInitialState,
  formData: FormData
): Promise<LoginResponse> {
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
  prevState: InitialState,
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
    return { message: "Please fill in all fields", successful: false };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match", successful: false };
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
