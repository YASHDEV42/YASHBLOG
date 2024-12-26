"use server";

// import { redirect } from "next/navigation";

const Register = async (prevState: FormData, formState: FormData) => {
  const name = formState.get("name") as string;
  const email = formState.get("email") as string;
  const password = formState.get("password") as string;
  const confirmPassword = formState.get("confirmPassword") as string;
  console.log(name, email, password, confirmPassword);

  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    return { message: "Please fill in all fields" };
  }
  if (password.length < 6) {
    return { message: "Password must be at least 6 characters" };
  }

  if (password !== confirmPassword) {
    return { message: "Passwords do not match" };
  }
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const existingUser = await prisma.user.findUnique({ where: { email } });
  //   if (existingUser) {
  //     return { message: "User already exists" };
  //   }

  //   const existingPhone = await prisma.user.findUnique({
  //     where: { phone_number: phoneNumber },
  //   });
  //   if (existingPhone) {
  //     return { message: "Phone number already exists" };
  //   }

  //   try {
  //     const user = await prisma.user.create({
  //       data: {
  //         email,
  //         name,
  //         password: hashedPassword,
  //         phone_number: phoneNumber,
  //       },
  //     });
  //     console.log(user);
  //   } catch (error) {
  //     return { message: "Something went wrong" };
  //   }

  //   redirect("/login");
};
export default Register;
