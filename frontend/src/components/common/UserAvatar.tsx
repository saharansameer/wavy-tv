import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src: string | undefined;
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
      <AvatarImage
        src={src}
        alt={`${altText}`}
        title={`@${title}`}
        className="bg-[#141414]"
      />
      <AvatarFallback
        className={scale ? "scale-200 font-semibold" : "font-semibold"}
      >
        {altText.split("")[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
