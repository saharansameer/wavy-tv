import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src: string;
  altText: string;
  title?: string;
  className?: string;
  scale?: boolean;
}

export function UserAvatar({
  src,
  altText,
  title,
  className,
  scale,
}: UserAvatarProps) {
  return (
    <Avatar className={className || ""}>
      <AvatarImage src={src} alt={`${altText}`} title={`@${title}`} />
      <AvatarFallback
        className={scale ? "scale-200 font-semibold" : "font-semibold"}
      >
        {altText.split("")[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
