import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "@/App";
import { Auth } from "@/layout";
import { Home, VideoFeed, PostFeed } from "@/pages";
import {
  NotFound,
  Video,
  VideoForm,
  Post,
  PostForm,
  UserProfile,
  Settings,
  WatchHistory,
} from "@/components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      {/* Default Route */}
      <Route path="/" element={<Home />} />

      {/* User Routes */}
      <Route path="/u">
        <Route path="*" element={<NotFound />} />
        <Route path=":username" element={<UserProfile />} />
      </Route>

      {/* Video Routes */}
      <Route path="/v">
        <Route path="*" element={<NotFound />} />
        <Route path="feed" element={<VideoFeed />} />
        <Route path=":publicId" element={<Video />} />
        <Route
          path="new"
          element={
            <Auth>
              <VideoForm />
            </Auth>
          }
        />
      </Route>

      {/* Post Routes */}
      <Route path="/p">
        <Route path="*" element={<NotFound />} />
        <Route path="feed" element={<PostFeed />} />
        <Route path=":publicId" element={<Post />} />
        <Route
          path="new"
          element={
            <Auth>
              <PostForm />
            </Auth>
          }
        />
      </Route>

      {/* Other Routes */}
      <Route path="*" element={<NotFound />} />
      <Route
        path="/settings"
        element={
          <Auth>
            <Settings />
          </Auth>
        }
      />
      <Route
        path="/history"
        element={
          <Auth>
            <WatchHistory />
          </Auth>
        }
      />
    </Route>
  )
);

export default router;
