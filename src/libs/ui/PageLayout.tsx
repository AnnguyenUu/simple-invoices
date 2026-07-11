import type { ReactNode } from "react";
import { Box, Heading } from "@radix-ui/themes";

export function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box>
      <Heading as="h1" size="6" mb="4">
        {title}
      </Heading>
      {children}
    </Box>
  );
}
