"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, Select, TextField } from "@radix-ui/themes";
import type { InvoiceStatus } from "@/types/invoice";
import { PAGE_SIZE_OPTIONS, STATUS_FILTER_OPTIONS } from "./constants";

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
  // Local text so typing doesn't refetch on every keystroke — committed to
  // the real filter value after a short pause.
  const [keywordDraft, setKeywordDraft] = useState(value.keyword);

  useEffect(() => {
    setKeywordDraft(value.keyword);
  }, [value.keyword]);

  useEffect(() => {
    if (keywordDraft === value.keyword) return;
    const timeout = setTimeout(() => {
      onChange({ ...value, keyword: keywordDraft });
    }, 400);
    return () => clearTimeout(timeout);
    // Only re-run when the draft changes — including `value`/`onChange`
    // would reset the debounce timer on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordDraft]);

  return (
    <Flex align="end" gap="3" wrap="wrap" mb="4">
      <TextField.Root
        placeholder="Search invoice #..."
        value={keywordDraft}
        onChange={(e) => setKeywordDraft(e.target.value)}
        style={{ width: 220 }}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon />
        </TextField.Slot>
      </TextField.Root>

      <Select.Root
        value={value.status}
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

      <TextField.Root
        type="date"
        value={value.fromDate}
        max={value.toDate || undefined}
        onChange={(e) => onChange({ ...value, fromDate: e.target.value })}
        style={{ width: 160 }}
      />
      <TextField.Root
        type="date"
        value={value.toDate}
        min={value.fromDate || undefined}
        onChange={(e) => onChange({ ...value, toDate: e.target.value })}
        style={{ width: 160 }}
      />

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
