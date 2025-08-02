"use client";

import React, { useState } from "react";
import StudentPortalSidebar from "@/components/StudentPortalSidebar";
import AnnouncementsFeed from "@/components/AnnouncementsFeed";

export default function UpdatesPageClient({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen">
      <StudentPortalSidebar
        selectedHeader={selectedHeader}
        onHeaderSelect={setSelectedHeader}
      />
      <div className="flex w-full items-center justify-center">
        <div className="flex-grow h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6 ml-8">
          <div className="relative">
            <h2 className="text-2xl font-bold mb-4">
              Announcements
            </h2>
            <AnnouncementsFeed
              header={selectedHeader}
              userId={userId}
              userName={userName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
