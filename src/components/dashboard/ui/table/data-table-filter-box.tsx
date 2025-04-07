"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn, debounce } from "@/lib/utils";
import { CheckIcon, CirclePlusIcon, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DataTableResetFilter } from "./data-table-reset-filter";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterBoxProps {
  resetFilters: () => void;
  isAnyFilterActive: boolean;
  filterKey: string;
  title: string;
  options: FilterOption[];
  setFilterValue: (
    value: string | ((old: string) => string | null) | null,
    options?: any
  ) => Promise<URLSearchParams>;
  filterValue: string;
}

export function DataTableFilterBox({
  filterKey,
  title,
  options,
  setFilterValue,
  isAnyFilterActive,
  filterValue,
  resetFilters,
}: FilterBoxProps) {
  const [isPending, startTransition] = React.useTransition();
  const selectedValuesSet = React.useMemo(() => {
    if (!filterValue) return new Set<string>();
    const values = filterValue.split(",");
    return new Set(values.filter((value) => value !== ""));
  }, [filterValue]);
  const [selectedOptions, setSelectedOptions] = useState(selectedValuesSet);

  const handleSelect = (value: string) => {
    const newSet = new Set(selectedOptions);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedOptions(newSet);
  };

  useEffect(() => {
    const selectedOptionsArray = Array.from(selectedOptions).sort().join(",");
    const originalOptionsArray = Array.from(selectedValuesSet).sort().join(",");

    // Only update if the values have actually changed
    if (selectedOptionsArray !== originalOptionsArray) {
      const updateFilter = debounce(() => {
        startTransition(() => {
          setFilterValue(
            Array.from(selectedOptions).join(",") || null,
            filterKey
          );
        });
      }, 300);

      updateFilter();
    }

    return () => {};
  }, [selectedOptions, filterKey, setFilterValue, selectedValuesSet]);

  const resetFilter = () => {
    setSelectedOptions(new Set());
    resetFilters();
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default" className="border-dashed">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CirclePlusIcon className="mr-2 h-4 w-4" />
            )}
            {title}
            {selectedOptions.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedOptions.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedOptions.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedOptions.size} selected
                    </Badge>
                  ) : (
                    Array.from(selectedOptions).map((value) => (
                      <Badge
                        variant="secondary"
                        key={value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {options.find((option) => option.value === value)
                          ?.label || value}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[200px] p-0 ")} align="start">
          <Command className="text-white bg-[#141414]">
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    className="text-white hover:bg-red-400! hover:text-white! hover:cursor-pointer"
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center border-red-900 rounded-sm border border-primary",
                        selectedOptions.has(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    {option.icon && (
                      <option.icon
                        className="mr-2 h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {selectedOptions.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      className="text-white hover:bg-red-400! hover:text-white! hover:cursor-pointer justify-center text-center"
                      onSelect={resetFilter}
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilter}
      />
    </>
  );
}
