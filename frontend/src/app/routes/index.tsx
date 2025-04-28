import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "@/App";
import { Auth } from "@/layout";
import { Home, VideoFeed, PostFeed } from "@/pages";
import { VideoForm, NotFound, Video } from "@/components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/vf" element={<VideoFeed />} />
      <Route path="/pf" element={<PostFeed />} />
      <Route
        path="/upload"
        element={
          <Auth>
            <VideoForm />
          </Auth>
        }
      />
      <Route path="/v/:publicId" element={<Video />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
