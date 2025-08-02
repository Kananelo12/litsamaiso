"use client";

import React, { useState } from "react";
import StudentPortalSidebar from "@/components/StudentPortalSidebar";
import AnnouncementsFeed from "@/components/AnnouncementsFeed";
import AnnouncementForm from "@/components/AnnouncementForm";
import { Plus } from "lucide-react";

export default function SRCDashboardClient({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  return (
    <div className="flex min-h-screen">
      <StudentPortalSidebar
        selectedHeader={selectedHeader}
        onHeaderSelect={setSelectedHeader}
      />
      <div className="flex w-full items-center justify-center">
        <div className="flex-grow h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6 ml-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Announcements</h2>
            <button
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Post
            </button>
          </div>

          {/* Announcement Form - Only show when Add Post is clicked */}
          {showAnnouncementForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Create New Announcement
                </h3>
                <button
                  onClick={() => setShowAnnouncementForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <AnnouncementForm userId={userId} />
            </div>
          )}

          <AnnouncementsFeed
            header={selectedHeader}
            userId={userId}
            userName={userName}
          />
        </div>
      </div>
    </div>
  );
}
