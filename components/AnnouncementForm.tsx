"use client";
import React, { useState, useTransition, useEffect } from "react";

export default function AnnouncementForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [header, setHeader] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [newHeader, setNewHeader] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchHeaders() {
      try {
        const res = await fetch("/api/announcements/headers");
        const data = await res.json();
        if (res.ok) setHeaders(data.data || []);
      } catch {}
    }
    fetchHeaders();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    startTransition(async () => {
      const usedHeader = newHeader.trim() ? newHeader.trim() : header;
      if (!usedHeader) {
        setError("Please select or enter a header.");
        return;
      }
      const postBody = {
        title,
        content,
        header: usedHeader,
        postedBy: userId,
      };
      console.log("Announcement POST body:", postBody);
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postBody),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Announcement posted!");
        setTitle("");
        setContent("");
        setHeader("");
        setNewHeader("");
      } else {
        setError(data.error || "Failed to post announcement");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 max-w-xl mx-auto p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Create Announcement</h2>
      <label className="block mb-1 font-medium">Header</label>
      <select
        className="w-full mb-2 p-2 border rounded"
        value={header}
        onChange={e => { setHeader(e.target.value); setNewHeader(""); }}
      >
        <option value="">Select existing header</option>
        {headers.map(h => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <div className="mb-2 text-center text-gray-500">or</div>
      <input
        className="w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Add new header"
        value={newHeader}
        onChange={e => { setNewHeader(e.target.value); setHeader(""); }}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isPending}
      >
        {isPending ? "Posting..." : "Post Announcement"}
      </button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}