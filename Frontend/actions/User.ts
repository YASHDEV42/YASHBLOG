"use server";
import { createClient } from "@/lib/server-supabase";
import { prisma } from "@/lib/db";

type LoginInitialState = {
  message: string | null;
};

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
  formState: FormData
): Promise<LoginResponse> {
  const supabase = await createClient();
  const email = formState.get("email") as string;
  const password = formState.get("password") as string;
  console.log(email, password);
  if (email === "" || password === "") {
    return { message: "Please fill in all fields" };
  }
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { message: error.message };
  }
  return { message: "Success" };
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

  console.log("Signup details:", { name, email });

  if (!name || !email || !password || !confirmPassword) {
    return { message: "Please fill in all fields", successful: false };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match", successful: false };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { message: "Invalid email format", successful: false };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return { message: error.message, successful: false };
  }

  if (!data.user) {
    return { message: "User not created in Supabase", successful: false };
  }

  console.log("Supabase response user:", data.user);

  try {
    console.log("Prisma user creation data:", {
      email: data.user.email,
      name: data.user.user_metadata?.name,
    });

    const user = await prisma.user.create({
      data: {
        id: data.user.id,
        email: data.user.email || "default@gmail.com",
        name: data.user.user_metadata?.name || "default user",
      },
    });

    console.log("User created in Prisma:", user);

    return {
      message: "Please check your email to verify your account",
      successful: true,
    };
  } catch (err) {
    console.log("Error creating user in database:", err);

    return { message: "Failed to create user in database", successful: false };
  }
};
