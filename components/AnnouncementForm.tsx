"use client";
import React, { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AnnouncementForm({ 
  userId, 
  onSuccess 
}: { 
  userId: string;
  onSuccess?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [header, setHeader] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [newHeader, setNewHeader] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
    
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    startTransition(async () => {
      const usedHeader = newHeader.trim() ? newHeader.trim() : header;
      if (!usedHeader) {
        toast.error("Please select or enter a header.");
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
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || "Failed to post announcement");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Announcement</h2>
        <p className="text-gray-600">Share important updates with your community</p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          value={header}
          onChange={e => { setHeader(e.target.value); setNewHeader(""); }}
        >
          <option value="">Select existing category</option>
          {headers.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>
      
      <div className="text-center text-gray-500 text-sm">or</div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">New Category</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          type="text"
          placeholder="Create new category"
          value={newHeader}
          onChange={e => { setNewHeader(e.target.value); setHeader(""); }}
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          type="text"
          placeholder="Enter announcement title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-vertical"
          placeholder="Write your announcement content here..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Publishing...
            </div>
          ) : (
            "Publish Announcement"
          )}
        </button>
      </div>
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          {error}
        </div>
      )}
    </form>
  );
}