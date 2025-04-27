import React from "react";

export function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}
