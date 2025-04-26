import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function UserAvatar({ src, alt, title, className }: UserAvatarProps) {
  return (
    <Avatar className={className || ""}>
      <AvatarImage src={src} alt={`${alt}`} title={`@${title}`} />
      <AvatarFallback>{alt.split("")[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
