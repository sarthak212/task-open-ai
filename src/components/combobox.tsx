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

export function Combobox({
  trigger,
  value,
  mode = "single",
  setValue,
  options,
  placeholder,
}: {
  trigger: React.ReactNode;
  placeholder?: string;
  value: string | string[] | undefined;
  setValue: (value: string | string[]) => void;
  mode?: "single" | "multiple";
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
}) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState<string | string[]>("");
  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        console.log("value ", value);
      }}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[200px] pointer-events-auto p-0">
        <Command>
          <CommandInput placeholder={placeholder ? placeholder : "Search..."} className="h-9" />
          <CommandList>
            <CommandEmpty>No Result found.</CommandEmpty>
            <CommandGroup>
              {options.map((framework) => (
                <CommandItem
                  key={framework.label}
                  className="gap-2"
                  value={framework.value}
                  onSelect={(currentValue) => {
                    if (mode === "multiple") {
                      if (Array.isArray(value)) {
                        if (value.includes(currentValue)) {
                          setValue(value.filter((v) => v !== currentValue));
                        } else {
                          setValue([...value, currentValue]);
                        }
                      } else {
                        setValue([currentValue]);
                      }
                    } else {
                      setValue(currentValue);
                    }
                    if (mode === "single") setOpen(false);
                  }}
                >
                  {mode == "multiple" && (
                    <Checkbox
                      color="indigo"
                      checked={
                        value === framework.value ||
                        (Array.isArray(value) && value.includes(framework.value))
                      }
                    />
                  )}
                  {/* {framework.icon} */}
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ||
                        (Array.isArray(value) && value.includes(framework.value))
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
