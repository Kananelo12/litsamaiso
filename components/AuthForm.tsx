"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import FormField from "./FormField";
import Link from "next/link";

// Define the form schema
const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: type === "sign-up" ? z.string().email() : z.string().optional(),
    studentId: z
      .string()
      .regex(/^\d{7}$/, "Student ID must be exactly 7 digits"),
    password: z.string().min(6, "Passwords must be atleast 6 characters long"),
    studentCard:
      type === "sign-up"
        ? z.custom<FileList>(
            (val) => val instanceof FileList && val.length > 0,
            {
              message: "Student card is required",
            }
          )
        : z.any().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const isSignIn = type === "sign-in";

  const formSchema = authFormSchema(type);

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      studentId: "",
      password: "",
      studentCard: undefined,
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        // Destructure relevant fields out of values
        console.log(values);
        const { name, email, studentId, password, studentCard } = values;

        const studentCardFile = (studentCard as FileList)[0]; // we know it's a FileList
        console.log("Student Card FIle: ", studentCardFile)

        // Upload step
        const uploadForm = new FormData();
        uploadForm.append("file", studentCardFile);
        console.log("Upload FORM: ", uploadForm)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm, // no need for headers
        });

        const { url: studentCardUrl } = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error("Failed to upload student card");
        }

        // Creating user in database
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            studentId,
            password,
            studentCardUrl,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        // Redirect upon successful authentication
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      } else {
        const { studentId, password } = values;

        // Authenticate user
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            password,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        toast.success("Signed in successfully!");
        // Redirect based on user role
        const role = data.user?.role;
        if (role === "src") {
          router.push("/src-dashboard");
        } else {
          router.push("/updates");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error: ${error}`);
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-left-content">
            <span className="small-title">Innovation Hub</span>
            <div>
              <h2>
                Get
                <br />
                Everything
                <br />
                You Want
              </h2>
              <p>
                You can get everything you want if you work hard,
                <br />
                trust the process, and stick to the plan.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="logo mb-5">
            <Image src="/logo-1.png" alt="Logo" width={35} height={35} />
            <h3 className="font-semibold text-2xl">Litsamaiso</h3>
          </div>

          <div className="auth-header">
            <h1 className="text-2xl font-semibold">
              {isSignIn
                ? "Welcome Back to the Litsamaiso"
                : "Create an Account"}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {isSignIn
                ? "Please fill all fields to gain access to the system."
                : "Please complete all fields and upload a valid university ID to gain access to the system"}
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {!isSignIn && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Your name"
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Your email address"
                    type="email"
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="studentId"
                label="Student ID Number"
                placeholder="e.g. 2230694"
              />
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="studentCard"
                  label="Upload University ID Card"
                  type="file"
                />
              )}
              <Button type="submit">
                {isSignIn ? "Sign in" : "Create Account"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm mt-4">
            {isSignIn
              ? "Don’t have an account yet? "
              : "Already have an account? "}
            <Link
              className="text-slate-900 font-bold"
              href={isSignIn ? "/sign-up" : "/sign-in"}
            >
              {isSignIn ? "Register here" : "Sign In"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
