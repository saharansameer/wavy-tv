# WavyTV

WavyTV is a web-based video streaming platform that supports uploading, browsing, and interacting with video content and community posts. Users can create content, vote on videos or posts, and share links, all within a single interactive platform.

---

## Features

#### Video & Content

- Upload, stream, and manage videos
- Create and view community posts
- Search for videos
- View and manage watch history

#### Social Interaction

- Add Comments and replies
- Upvote or downvote videos, posts, and comments
- Follow and unfollow other users
- View public user profiles

#### Account Settings

- Update email, password, and personal preferences

---

## Tech Stack

#### Backend

- Node.js
- Express
- MongoDB
- REST APIs
- JWT 

#### Frontend

- React
- Tailwind CSS
- shadcn/ui
- Zustand 
- TanStack Query
- React Hook Form
- Zod

#### Infrastructure / Tools

- Cloudinary
- TypeScript

---

## Architecture Notes

- **MERN Stack**: Built with MongoDB, Express, React (Vite), and Node.js, using TypeScript throughout the stack.
- **Authentication**: JWT-based auth system with secure access tokens and protected routes.
- **Media Storage**: Videos are uploaded to and served from Cloudinary for optimized delivery and transformation.
- **Data Modeling**: MongoDB schemas support users, videos, posts, comments, votes, history, and relationships (followers/following).
- **Voting System**: Upvotes/downvotes are normalized and stored per user-item pair (videos, posts, comments).
- **Pagination & Querying**: API responses are paginated using cursor-based logic; MongoDB aggregation pipelines power the feed, search, and recommendations.
- **Frontend State**: Zustand handles local/global state, while TanStack Query manages API caching and syncing.
- **Form Handling**: React Hook Form with Zod enables client-side validation and clean UI integration.
- **UI**: Built with Tailwind CSS and shadcn/ui components, designed to be responsive across devices.

---

## Deployment

Fully deployed and live at [`wavytv.sameersaharan.com`](https://wavytv.sameersaharan.com)  
built by [Sameer Saharan](https://sameersaharan.com)
