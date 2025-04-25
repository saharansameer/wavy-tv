import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src: string;
  alt: string;
  title: string;
}

export function UserAvatar({ src, alt, title }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={`${alt}`} title={`@${title}`} />
      <AvatarFallback>{alt.split("")[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
