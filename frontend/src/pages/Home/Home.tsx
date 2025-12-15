import React from "react";
import { axios } from "@/app/config/axios";
import { ScrollToTop } from "@/components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Video, FileText, Upload, PenSquare, ArrowRight } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Video Feed",
      description: "Discover trending videos from creators worldwide",
      icon: <Video className="h-6 w-6" />,
      path: "/v/feed",
      cardBg: "bg-gradient-to-br from-pink-500/20 to-purple-500/20",
    },
    {
      title: "Post Feed",
      description: "Connect with fresh updates from your community",
      icon: <FileText className="h-6 w-6" />,
      path: "/p/feed",
      cardBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Upload Video",
      description: "Share your creative moments instantly",
      icon: <Upload className="h-6 w-6" />,
      path: "/v/new",
      cardBg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
    },
    {
      title: "Create Post",
      description: "Express yourself with powerful storytelling",
      icon: <PenSquare className="h-6 w-6" />,
      path: "/p/new",
      cardBg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    },
  ];

  React.useEffect(() => {
    (async () => {
      await axios.get("/", { withCredentials: false });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />

      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Explore WavyTV
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create. Share. Connect.
        </p>
      </div>

      {/* Features Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => navigate(feature.path)}
                className="group relative text-left transition-all duration-300 hover:-translate-y-2"
              >
                <Card className="h-full bg-card border border-border overflow-hidden cursor-pointer">
                  <div
                    className={`absolute inset-0 ${feature.cardBg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  <CardContent className="px-6 py-2 relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`p-4 rounded-xl ${feature.cardBg} text-white group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.icon}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    <h3 className="text-2xl font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
