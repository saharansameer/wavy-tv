# WavyTV

WavyTV is a web-based video streaming platform built with the MERN stack using TypeScript. It combines video publishing with social interaction — users can upload content, create community posts, vote on videos or posts, and share links — all within a single, interactive platform. Media is stored and delivered efficiently using Cloudinary.

---

## Features

#### Video & Content

- Upload, stream, and manage videos
- Create and view community posts
- Search for videos
- View your watch history

#### Social Interaction

- Add Comments and replies
- Upvote or downvote videos, posts, and comments
- Follow and unfollow other users
- View public user profiles

#### Account Settings

- Edit email, password, and personal preferences

---

## Tech Stack

#### Backend

- Node.js
- Express
- MongoDB
- RESTful APIs
- JWT (Auth)

#### Frontend

- React (Vite)
- Tailwind CSS
- shadcn/ui
- Zustand (state management)
- TanStack Query (React-Query)
- React Hook Form + Zod (validation)

#### Infrastructure / Tools

- Cloudinary (media storage)
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

Fully deployed and live at [`wavytv.vercel.app`](https://wavytv.vercel.app)  
Built by [Sameer Saharan](https://sameersaharan.com)
