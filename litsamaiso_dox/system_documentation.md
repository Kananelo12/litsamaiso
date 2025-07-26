# Introduction

---

This project aims to develop a **Student Representative Council (SRC) Communication App** that bridges the gap between student leaders and the student body. The platform allows SRC members to post updates about events, notices, and other important information, while enabling students to engage with these posts through likes and replies.

The first increment focuses on delivering a **Minimum Viable Product (MVP)** with core interaction features.

---

# Problem Statement

---

In Botho University, communication between the SRC and students is often fragmented and ineffective across different plartforms. Important updates may be missed, and there is limited opportunity for students to engage directly with SRC announcements in one platform. This leads to poor awareness, miscommunication, and low student involvement in campus activities.

This application aims to address this by providing a centralized platform for SRC updates with interactive capabilities like likes and replies.

---

# System Requirements

---

## Functional Requirements

- SRC members can post textual updates.
- Students can view a chronological feed of SRC updates.
- Students can like updates (one like per user per update).
- Students can reply (comment) to updates.
- A spreadsheet containing all official student bank account records is uploaded by the admin.
- The system checks the provided data against the spreadsheet to confirm the student bank account.

## Non-Functional Requirements

- The system should be mobile-responsive.
- Updates and interactions should persist in the database.
- Replies should be displayed in order (newest first or oldest first toggle).
- Only authenticated users can interact (post, like, reply).
- Should handle at least --- concurrent users with no performance degradation.

---

# User Stories

---

### SRC Member

- **As an SRC member**, I want to post updates so that students stay informed about important events and announcements.
- **As an SRC member**, I want to attend accounts confirmation quiries.

### Student

- **As a student**, I want to view updates from SRC so that I stay informed.
- **As a student**, I want to like updates to show support or agreement.
- **As a student**, I want to reply to updates to ask questions or give feedback.
- **As a student**, I want to confirm my bank account by entering studentID and bank account number during NMDS accounts confirmation.

---

# TechStack

---

- **NEXT.JS** - [FullStack Framework](https://nextjs.org/docs)
- **VERCEL** - [Deployment Service](https://vercel.com/docs)
- **ATLAS MongoDB** - [Online Databese storage](https://www.mongodb.com/docs/atlas/getting-started/)
