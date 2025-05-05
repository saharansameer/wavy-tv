import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollToTop } from "@/components";
import { Video, FileText, Upload, PenSquare } from "lucide-react";

export function Home() {
  const categories = [
    {
      title: "Video Feed",
      description: "Explore the hottest videos from creators everywhere",
      icon: <Video className="h-6 w-6" />,
      path: "/v/feed",
      gradient: "from-pink-500/20 to-purple-500/20",
      hoverGradient: "hover:from-pink-500/30 hover:to-purple-500/30",
    },
    {
      title: "Post Feed",
      description: "Catch up on fresh posts and updates from your connections",
      icon: <FileText className="h-6 w-6" />,
      path: "/p/feed",
      gradient: "from-blue-500/20 to-cyan-500/20",
      hoverGradient: "hover:from-blue-500/30 hover:to-cyan-500/30",
    },
    {
      title: "Upload Video",
      description: "Showcase your moments to the wavyTV community",
      icon: <Upload className="h-6 w-6" />,
      path: "/v/new",
      gradient: "from-amber-500/20 to-orange-500/20",
      hoverGradient: "hover:from-amber-500/30 hover:to-orange-500/30",
    },
    {
      title: "Create Post",
      description: "Express yourself with text and beyond",
      icon: <PenSquare className="h-6 w-6" />,
      path: "/p/new",
      gradient: "from-emerald-500/20 to-teal-500/20",
      hoverGradient: "hover:from-emerald-500/30 hover:to-teal-500/30",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ScrollToTop />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Step into wavyTV
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          simple. social. seamless.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-10 px-5">
        {categories.map((category, index) => (
          <Link
            to={category.path}
            key={index}
            className="h-full flex justify-center"
          >
            <Card
              className={`w-80 h-full transition-all duration-300 bg-gradient-to-br ${category.gradient} ${category.hoverGradient} hover:shadow-lg border border-border/50`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <div className="p-2 rounded-full bg-background/80 backdrop-blur-sm">
                    {category.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-foreground/80">
                  {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
