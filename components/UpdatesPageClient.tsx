"use client";

import React, { useState } from "react";
import StudentPortalSidebar from "@/components/StudentPortalSidebar";
import AnnouncementsFeed from "@/components/AnnouncementsFeed";

export default function UpdatesPageClient({
  userId,
  userName,
}: {
  userId?: string;
  userName?: string;
}) {
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
  return (
    <div className="flex min-h-screen">
      <StudentPortalSidebar
        selectedHeader={selectedHeader}
        onHeaderSelect={setSelectedHeader}
      />
      <div className="flex w-full items-center justify-center">
        <div className="flex-grow max-w-7xl h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg mt-20 mx-8 custom-scrollbar">
          <div className="relative">
            <div className="sticky top-0 bg-white z-10 py-2 px-5">
              <h2 className="text-2xl font-bold mb-4">Announcements</h2>
            </div>
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
