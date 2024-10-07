export default function IconButton({
  variant = "outline",
  children,
  dottedborder,
  ...props
}: {
  variant: "outline" | "solid";
  children: React.ReactNode | string;
  [key: string]: any;
}) {
  return (
    <div
      className={`py-1 px-2 border ${
        dottedborder ? "border-dashed" : ""
      }  cursor-pointer flex gap-2 items-center border-[#DFE1E4] rounded-lg`}
      {...props}
    >
      {children}
    </div>
  );
}
