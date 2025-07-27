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
    studentId: z.string().regex(/^\d{7}$/, "Student ID must be exactly 7 digits"),
    password: z.string().min(6, "Passwords must be atleast 6 characters long"),
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
    },
  });

  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        // Destructure relevant fields out of values
        const { name, email, studentId, password } = values;
        console.log(values);

        // Authenticate user

        // Redirect upon successful authentication
        toast.success("Account created successfully! Please sign in.");
        router.push("/sign-in");
      } else {
        const { studentId, password } = values;
        console.log("Student ID: ", studentId);
        console.log("Password: ", password);
        toast.success("Signed in successfully!");
        router.push("/");
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
              {isSignIn ? "Welcome Back to the Litsamaiso" : "Create an Account"}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {isSignIn ? "Please fill all fields to gain access to the system." : "Please complete all fields and upload a valid university ID to gain access to the system"}
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
              <Button type="submit">
                {isSignIn ? "Sign in" : "Create Account"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm mt-4">
            {isSignIn ? "Don’t have an account yet? " : "Already have an account? "}
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
