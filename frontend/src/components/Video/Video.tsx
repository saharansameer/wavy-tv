import { useParams, useLocation } from "react-router-dom";
import { CustomVideoPlayer } from "./VideoPlayer";

export function Video() {
  const { publicId } = useParams();
  const { state } = useLocation();
  return <CustomVideoPlayer src={state.src} />;
}
