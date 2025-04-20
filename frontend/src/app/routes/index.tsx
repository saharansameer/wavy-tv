import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "@/App";
import { Home } from "@/pages";
import { VideoForm, NotFound } from "@/components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<VideoForm />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
