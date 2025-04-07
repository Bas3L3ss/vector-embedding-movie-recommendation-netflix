import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

interface MultiSelectProps {
  selected: string[];
  onChange: (values: string[]) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  selected,
  onChange,
  options,
  placeholder = "Select options",
  className,
  disabled = false,
}: MultiSelectProps) {
  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  // Get the label for a value
  const getLabel = (value: string) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between min-h-10 h-auto py-2",
            selected.length > 0 ? "pl-3 pr-2" : "px-3",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selected.map((value) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {getLabel(value)}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(value);
                      }}
                    >
                      <X className="h-3 w-3 cursor-pointer opacity-70 hover:opacity-100 block" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search options..." className="h-9" />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <CommandItem
                  key={opt.value}
                  onSelect={() => handleToggle(opt.value)}
                  className={cn(
                    "flex items-center gap-2 py-2",
                    isSelected ? "bg-secondary/50" : ""
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mr-1 data-[state=checked]:bg-primary border-primary/30"
                  />
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
