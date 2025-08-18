"use client";

import React, { useState } from "react";
import StudentPortalSidebar from "@/components/StudentPortalSidebar";
import AnnouncementsFeed from "@/components/AnnouncementsFeed";
import AnnouncementForm from "@/components/AnnouncementForm";
import { Plus, X } from "lucide-react";

export default function SRCDashboardClient({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  return (
    <div className="flex min-h-screen">
      <StudentPortalSidebar
        selectedHeader={selectedHeader}
        onHeaderSelect={setSelectedHeader}
      />
      
      <div className="flex w-full items-center justify-center">
        <div className="flex-grow max-w-7xl h-[80vh] bg-white rounded-2xl shadow-lg mt-20 mx-8 overflow-hidden flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white z-20 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and create announcements for students
                </p>
              </div>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Post
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6">
              <AnnouncementsFeed
                header={selectedHeader}
                userId={userId}
                userName={userName}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Create New Announcement
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Share important updates with students
                </p>
              </div>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
              <AnnouncementForm 
                userId={userId} 
                onSuccess={() => setShowAnnouncementModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}