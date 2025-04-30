import Linkify from "react-linkify";
import { Link } from "react-router-dom";

export function TextLinkify({ text }: { text: string }) {
  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <Link
          to={decoratedHref}
          key={key}
          rel="noopener noreferrer"
          className="underline text-[#3578ff] "
        >
          {decoratedText}
        </Link>
      )}
    >
      {text}
    </Linkify>
  );
}
