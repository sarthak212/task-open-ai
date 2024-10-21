"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

export function LinkPopover({
  trigger,
  defaultValue,
  onAdd,
}: {
  trigger: React.ReactNode;
  defaultValue: string;
  onAdd: any;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  // const [value, setValue] = React.useState<string | string[]>("");
  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className=" pointer-events-auto p-0">
        <div className="flex p-3 gap-2 items-center">
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            size={1}
            className="h-[32px] min-w-[150px]"
          />
          <Button
            size={"sm"}
            className="h-[32px]"
            onClick={() => {
              onAdd(value);
            }}
          >
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
