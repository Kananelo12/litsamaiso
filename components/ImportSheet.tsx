/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const ImportSheet = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  // file input change
  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  // form submit
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import/spreadsheet", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      toast.success(`Imported ${data.imported} records!`);
      setShowModal(false);
      // optional: refresh or navigate
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload error");
    }
  }

  return (
    <>
      {/* Floating circular button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-black/80 hover:bg-black/60 rounded-full border border-gray-700 hover:border-teal-100 transition-all duration-300 z-50"
        aria-label="Open import modal"
      >
        <Upload className="w-6 h-6 text-white" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Import Spreadsheet
            </h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={onFileChange}
                className="block w-full text-gray-700 dark:text-gray-200"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportSheet;
