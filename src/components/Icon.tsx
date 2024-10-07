export default function Icon({
  className,
  name,
  ...props
}: {
  className?: string;
  name: string;
  [key: string]: any;
}) {
  let src = "";
  switch (name) {
    case "flash":
      src = "flash.svg";
      break;
    case "right":
      src = "ei_chevron-right.svg";
      break;
    case "dotted":
      src = "dottedline.svg";
      break;
    case "user":
      src = "user.svg";
      break;
    case "flag":
      src = "flag.svg";
      break;
    case "tag":
      src = "tags.svg";
      break;
    case "files":
      src = "files.svg";
      break;
    case "date":
      src = "date.svg";
      break;
    case "frame":
      src = "frame.svg";
      break;
    case "enter":
      src = "uil_enter.svg";
      break;
    case "ai":
      src = "ai.svg";
      break;
    default:
      src = "frame.svg";

      break;
  }

  return <img src={`/icons/${src}`} alt="avatar" className={className} />;
}
