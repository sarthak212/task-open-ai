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
    case "italian":
      src = "Italian.svg";
      break;
    case "pin":
      src = "pin.svg";
      break;
    case "emoji":
      src = "face.svg";
      break;
    case "heading":
      src = "highlight.svg";
      break;
    case "bold":
      src = "Bold.svg";
      break;
    case "code":
      src = "code.svg";
      break;
    case "link":
      src = "link.svg";
      break;
    case "number_list":
      src = "number_list.svg";
      break;
    case "dottedlist":
      src = "dottedlist.svg";
      break;
    case "check_list":
      src = "check_list.svg";
      break;
    default:
      src = "frame.svg";

      break;
  }

  return <img src={`/icons/${src}`} alt="avatar" className={className} />;
}
