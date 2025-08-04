/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";
import { MessageCircle, ThumbsUp, Share2, Reply } from "lucide-react";

type Announcement = {
  _id: string;
  title: string;
  content: string;
  header: string;
  date?: string;
  postedBy?: { name?: string; email?: string };
  likes?: string[];
  comments?: any[];
};

function AnnouncementCard({ announcement, userId, userName }: { announcement: any, userId: string, userName: string }) {
  const [likes, setLikes] = useState(announcement.likes || []);
  const [comments, setComments] = useState(announcement.comments || []);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const isLiked = likes.includes(userId);
  const likeCount = likes.length;
  // Like handler
  const handleLike = async () => {
    const res = await fetch(`/api/announcements/${announcement._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, like: !isLiked }),
    });
    if (res.ok) {
      setLikes((like: string[]) =>
        isLiked ? like.filter((id: string) => id !== userId) : [...like, userId]
      );
    }
  };
  // Comment handler
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    // Add comment immediately to UI for better UX
    const newComment = {
      user: { name: userName },
      text: commentText,
      date: new Date(),
      replies: []
    };
    setComments((prev: any[]) => [...prev, newComment]);
    setCommentText("");
    
    // Send to server
    const res = await fetch(`/api/announcements/${announcement._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text: commentText }),
    });
    if (!res.ok) {
      // If failed, remove the comment from UI
      setComments((prev: any[]) => prev.slice(0, -1));
    }
  };

  // Reply handler
  const handleReply = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo) return;
    
    // Add reply immediately to UI for better UX
    const newReply = {
      user: { name: userName },
      text: replyText,
      date: new Date()
    };
    
    setComments((prev: any[]) => 
      prev.map((comment: any) => 
        comment._id === commentId 
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      )
    );
    setReplyText("");
    setReplyingTo(null);
    
    // Send to server
    const res = await fetch(`/api/announcements/${announcement._id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, userId, text: replyText }),
    });
    
    if (!res.ok) {
      // If failed, remove the reply from UI
      setComments((prev: any[]) => 
        prev.map((comment: any) => 
          comment._id === commentId 
            ? { ...comment, replies: comment.replies.slice(0, -1) }
            : comment
        )
      );
    }
  };
  return (
    <div
      className="bg-white rounded-2xl shadow p-5 mb-6 max-w-6xl mx-auto border-l-4 border-purple-200"
    >
      {/* Header: Name, Date/Time */}
      <div className="flex items-center mb-2">
        <span className="font-semibold mr-2">{announcement.postedBy?.name || "SRC Member"}</span>
        <span className="text-xs text-gray-400">
          {announcement.date && new Date(announcement.date).toLocaleString()}
        </span>
      </div>
      {/* Topic/Title */}
      <div className="mb-1">
        <span className="font-bold">Topic :</span>
        <span className="italic ml-1">{announcement.title}</span>
      </div>
      {/* Content */}
      <div className="text-gray-700 mb-2">{announcement.content}</div>
      {/* Actions (Lucide icons) */}
      <div className="flex gap-4 text-gray-400 text-sm items-center mb-2">
        <button title="Like" onClick={handleLike} className={isLiked ? "text-green-600" : ""}>
          <ThumbsUp className="w-4 h-4 inline" /> {likeCount}
        </button>
        <span>|</span>
        <button 
          title="Comments" 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-gray-600"
        >
          <MessageCircle className="w-4 h-4" /> {comments.length}
        </button>
        <span>|</span>
        <button title="Share"><Share2 className="w-4 h-4" /></button>
      </div>
      {/* Comments Section - Only show when showComments is true */}
      {showComments && (
        <>
          {/* Comments */}
          <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border rounded p-2">
            {comments.map((c: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded p-2 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold mr-2">
                    {c.user?.name || (c.user === userId ? userName : "User")}
                  </span>
                  <button
                    onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                    className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                </div>
                <span className="text-xs text-gray-400">{c.date && new Date(c.date).toLocaleString()}</span>
                <div className="mb-2">{c.text}</div>
                
                                 {/* Replies */}
                 {c.replies && c.replies.length > 0 && (
                   <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                     {c.replies.map((reply: any, replyIdx: number) => (
                       <div key={replyIdx} className="bg-white rounded p-1 text-xs">
                         <div className="flex items-center justify-between mb-1">
                           <span className="font-semibold mr-2">
                             {reply.user?.name || (reply.user === userId ? userName : "User")}
                           </span>
                           <button
                             onClick={() => setReplyingTo(replyingTo === `${c._id}-reply-${replyIdx}` ? null : `${c._id}-reply-${replyIdx}`)}
                             className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1"
                           >
                             <Reply className="w-3 h-3" />
                             Reply
                           </button>
                         </div>
                         <span className="text-xs text-gray-400">
                           {reply.date && new Date(reply.date).toLocaleString()}
                         </span>
                         <div className="mb-1">{reply.text}</div>
                         
                         {/* Reply Form for nested replies */}
                         {replyingTo === `${c._id}-reply-${replyIdx}` && (
                           <form onSubmit={(e) => handleReply(e, c._id)} className="mt-1 flex gap-2">
                             <input
                               className="flex-1 border rounded p-1 text-xs"
                               placeholder="Write a reply..."
                               value={replyText}
                               onChange={e => setReplyText(e.target.value)}
                             />
                             <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                               Reply
                             </button>
                             <button 
                               type="button" 
                               onClick={() => setReplyingTo(null)}
                               className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                             >
                               Cancel
                             </button>
                           </form>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
                
                {/* Reply Form */}
                {replyingTo === c._id && (
                  <form onSubmit={(e) => handleReply(e, c._id)} className="mt-2 flex gap-2">
                    <input
                      className="flex-1 border rounded p-1 text-xs"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      Reply
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setReplyingTo(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
          {/* Add Comment */}
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <input
              className="flex-1 border rounded p-1 text-sm"
              placeholder="Add a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
                         <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Post</button>
          </form>
        </>
      )}
    </div>
  );
}

export default function AnnouncementsFeed({ header, userId, userName }: { header?: string | null, userId: string, userName: string }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/announcements");
        const data = await res.json();
        if (res.ok) {
          setAnnouncements(data.data || []);
        } else {
          setError(data.error || "Failed to fetch announcements");
        }
      } catch (error) {
        setError(`Failed to fetch announcements: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const filtered = header ? announcements.filter(a => a.header === header) : announcements;

  if (loading) return <div>Loading announcements...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!filtered.length) return <div>No announcements yet.</div>;

  return (
    <div className="space-y-6 px-5">
      {filtered.map(a => (
        <AnnouncementCard key={a._id} announcement={a} userId={userId} userName={userName} />
      ))}
    </div>
  );
}