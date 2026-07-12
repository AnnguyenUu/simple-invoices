"use client";

import { ChangeEvent, startTransition, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Flex, Select, TextField } from "@radix-ui/themes";
import type { InvoiceStatus } from "@/types/invoice";
import { PAGE_SIZE_OPTIONS, STATUS_FILTER_OPTIONS } from "./constants";
import { useDebounceCallback } from "@/hooks/useDebounce";

export type InvoiceFiltersValue = {
  keyword: string;
  status: InvoiceStatus | "ALL";
  fromDate: string;
  toDate: string;
  pageSize: number;
};

export function InvoicesFilters({
  value,
  onChange,
}: {
  value: InvoiceFiltersValue;
  onChange: (next: InvoiceFiltersValue) => void;
}) {
  const [keywordDraft, setKeywordDraft] = useState(value?.keyword);

  const debounced = useDebounceCallback(onChange, 500);
  
  const onChangeTextField = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setKeywordDraft(e.target.value);

    startTransition(() => {
      debounced({ ...value, keyword: e.target.value });
    });
  };

  return (
    <Flex align="end" gap="3" wrap="wrap" mb="4">
      <Box width={{ initial: "100%", xs: "220px" }}>
        <TextField.Root
          placeholder="Search invoice #..."
          value={keywordDraft}
          onChange={onChangeTextField}
          style={{ width: "100%" }}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon />
          </TextField.Slot>
        </TextField.Root>
      </Box>

      <Select.Root
        value={value?.status}
        onValueChange={(status) =>
          onChange({ ...value, status: status as InvoiceStatus | "ALL" })
        }
      >
        <Select.Trigger placeholder="Status" />
        <Select.Content>
          {STATUS_FILTER_OPTIONS.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Box width={{ initial: "calc(50% - 6px)", xs: "160px" }}>
        <TextField.Root
          type="date"
          value={value.fromDate}
          max={value.toDate || undefined}
          onChange={(e) => onChange({ ...value, fromDate: e.target.value })}
          style={{ width: "100%" }}
        />
      </Box>
      <Box width={{ initial: "calc(50% - 6px)", xs: "160px" }}>
        <TextField.Root
          type="date"
          value={value.toDate}
          min={value.fromDate || undefined}
          onChange={(e) => onChange({ ...value, toDate: e.target.value })}
          style={{ width: "100%" }}
        />
      </Box>

      <Select.Root
        value={String(value.pageSize)}
        onValueChange={(size) => onChange({ ...value, pageSize: Number(size) })}
      >
        <Select.Trigger />
        <Select.Content>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <Select.Item key={size} value={String(size)}>
              {size} / page
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}
