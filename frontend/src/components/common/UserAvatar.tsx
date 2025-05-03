import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  scale?: boolean;
}

export function UserAvatar({
  src,
  alt,
  title,
  className,
  scale,
}: UserAvatarProps) {
  return (
    <Avatar className={className || ""}>
      <AvatarImage src={src} alt={`${alt}`} title={`@${title}`} />
      <AvatarFallback
        className={scale ? "scale-200 font-semibold" : "font-semibold"}
      >
        {alt.split("")[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
