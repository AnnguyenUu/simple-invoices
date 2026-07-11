"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Flex, IconButton, Text, TextField } from "@radix-ui/themes";

export function Pagination({
  pageNum,
  totalPages,
  disableNext,
  onChange,
}: {
  pageNum: number;
  totalPages: number;
  disableNext: boolean;
  onChange: (page: number) => void;
}) {
  const [draft, setDraft] = useState(String(pageNum));

  useEffect(() => {
    setDraft(String(pageNum));
  }, [pageNum]);

  const commit = () => {
    const parsed = Math.trunc(Number(draft));
    const clamped = Number.isFinite(parsed)
      ? Math.min(Math.max(parsed, 1), totalPages)
      : pageNum;
    setDraft(String(clamped));
    if (clamped !== pageNum) onChange(clamped);
  };

  return (
    <Flex align="center" gap="3">
      <IconButton
        variant="soft"
        color="gray"
        disabled={pageNum <= 1}
        onClick={() => onChange(1)}
        aria-label="First page"
      >
        <DoubleArrowLeftIcon />
      </IconButton>
      <IconButton
        variant="soft"
        color="gray"
        disabled={pageNum <= 1}
        onClick={() => onChange(Math.max(1, pageNum - 1))}
        aria-label="Previous page"
      >
        <ChevronLeftIcon />
      </IconButton>

      <Flex align="center" gap="2">
        <Text size="2" color="gray">
          Page
        </Text>
        <TextField.Root
          size="1"
          type="number"
          min={1}
          max={totalPages}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
          }}
          style={{ width: 56, textAlign: "center" }}
        />
        <Text size="2" color="gray">
          of {totalPages}
        </Text>
      </Flex>

      <IconButton
        variant="soft"
        color="gray"
        disabled={pageNum >= totalPages || disableNext}
        onClick={() => onChange(Math.min(totalPages, pageNum + 1))}
        aria-label="Next page"
      >
        <ChevronRightIcon />
      </IconButton>
      <IconButton
        variant="soft"
        color="gray"
        disabled={pageNum >= totalPages || disableNext}
        onClick={() => onChange(totalPages)}
        aria-label="Last page"
      >
        <DoubleArrowRightIcon />
      </IconButton>
    </Flex>
  );
}
