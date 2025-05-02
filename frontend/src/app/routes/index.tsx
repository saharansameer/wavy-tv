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
} from "@/components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      {/* Default Route */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />

      {/* User Routes */}
      <Route path="/u">
        <Route path="" element={<NotFound />} />
        <Route path=":username" element={<UserProfile />} />
      </Route>

      {/* Settings Routes */}
      <Route
        path="/settings"
        element={
          <Auth>
            <Settings />
          </Auth>
        }
      />

      {/* Video Routes */}
      <Route path="/v">
        <Route path="" element={<NotFound />} />
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
        <Route path="" element={<NotFound />} />
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
    </Route>
  )
);

export default router;
