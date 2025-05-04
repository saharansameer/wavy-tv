type ContentNavigationProps = {
  activeTab: "videos" | "posts";
  onTabChange: (tab: "videos" | "posts") => void;
};

export function ContentNavigation({
  activeTab,
  onTabChange,
}: ContentNavigationProps) {
  return (
    <div className="border-b">
      <div className="flex px-6 md:px-10">
        <button
          onClick={() => onTabChange("videos")}
          className={`py-4 px-4 font-medium relative cursor-pointer transition-colors ease-in-out duration-500 ${
            activeTab === "videos" ? "text-primary" : "text-secondary"
          }`}
        >
          Videos
          {activeTab === "videos" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
          )}
        </button>
        <button
          onClick={() => onTabChange("posts")}
          className={`py-4 px-4 font-medium relative cursor-pointer transition-colors ease-in-out duration-500 ${
            activeTab === "posts" ? "text-primary" : "text-secondary "
          }`}
        >
          Posts
          {activeTab === "posts" && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
          )}
        </button>
      </div>
    </div>
  );
}
