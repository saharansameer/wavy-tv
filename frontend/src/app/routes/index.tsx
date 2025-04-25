import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "@/App";
import { Home, Auth } from "@/pages";
import { VideoForm, NotFound, LoadingOverlay, Video } from "@/components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route
        path="/upload"
        element={
          <Auth skeleton={<LoadingOverlay />}>
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
