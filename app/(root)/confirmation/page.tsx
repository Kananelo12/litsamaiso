"use client";

import FormField from "@/components/FormField";
import StudentPortalSidebar from "@/components/StudentPortalSidebar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, useInView } from "framer-motion";
import Earth from "@/components/ui/globe"
import { toast } from "sonner";

const emptyState = false;

// Define the form schema
const confirmationFormSchema = () => {
  return z.object({
    contractNumber: z.string().regex(/^\d{12}$/, "Contract number must be exactly 12 digits"),
    studentId: z
      .string()
      .regex(/^\d{7}$/, "Student ID must be exactly 7 digits"),
    bankName: z.string().min(3),
    accountNumber: z.string(),
  });
};

const Page = () => {
  const formRef = useRef(null);
  const isInView = useInView(formRef, { once: true, amount: 0.3 });

  const formSchema = confirmationFormSchema();

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractNumber: "",
      studentId: "",
      bankName: "",
      accountNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

      const { contractNumber, studentId, bankName, accountNumber } = values;

      const response = await fetch("/api/confirmation", {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
          contractNumber,
          studentId,
          bankName,
          accountNumber,
        })
      });

      const data = await response.json();
      console.log("Confirmation Response: ", data);

      if (!response.ok) {
        toast.error(data.error || "Something went wrong")
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data?.message);

    } catch (error) {
      console.log("Error: ", error);
    }
  }

  return (
    <div className="global-bg">
      <div className="main flex min-h-screen">
        <StudentPortalSidebar />

        <div className="w-full flex items-center justify-center">
          {!emptyState ? (
            <div className="bg-secondary/20 mx-auto max-w-5xl rounded-2xl border shadow-xl py-5 px-10">
              <div className="grid md:grid-cols-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-10"
                  >
                    <FormField
                      control={form.control}
                      name="contractNumber"
                      label="Contract Number"
                      placeholder="e.g. 202211001706"
                    />
                    <FormField
                      control={form.control}
                      name="studentId"
                      label="Student Id"
                      placeholder="e.g. 2230604"
                    />
                    <FormField
                      control={form.control}
                      name="bankName"
                      label="Bank Name"
                      placeholder="Your banking provider"
                    />
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      label="Bank Account Number"
                      placeholder="63056005005"
                    />
                    <Button type="submit">Confirm Account</Button>
                  </form>
                </Form>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative my-8 flex items-center justify-center overflow-hidden pr-8"
                >
                  <div className="flex flex-col items-center justify-center overflow-hidden">
                    <article className="relative mx-auto h-[350px] min-h-60 max-w-[450px] overflow-hidden rounded-3xl border bg-gradient-to-b from-[#e60a64] to-[#e60a64]/5 p-6 text-3xl tracking-tight text-white md:h-[450px] md:min-h-80 md:p-8 md:text-4xl md:leading-[1.05] lg:text-5xl">
                      Why walk to campus when you can tap?
                      <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
                        <Earth
                          scale={1.1}
                          baseColor={[1, 0, 0.3]}
                          markerColor={[0, 0, 0]}
                          glowColor={[1, 0.3, 0.4]}
                        />
                      </div>
                    </article>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="main-content text-center max-w-3xl">
              <h2 className="text-5xl font-bold mb-7">
                Confirmation Period Inactive
              </h2>
              <p>
                You’ll get notified once the confirmation of accounts is due.
                Check out the updates to get the latest information and
                instructions from the SRC.
              </p>

              <div className="w-full flex justify-center my-8">
                <Image
                  src="/empty state confirmations.png"
                  alt="Confirmations Empty State"
                  width={200}
                  height={200}
                />
              </div>

              <Link
                href="/updates"
                className="w-full bg-slate-950 rounded-md text-white px-32 py-3"
              >
                Go to Updates
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;