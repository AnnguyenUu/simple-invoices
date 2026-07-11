"use client";

import { ExitIcon, FileTextIcon, PlusIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import { logout } from "@/api/auth/logout";
import { useGetUserProfile } from "@/modules/users-profile/core/handlers/get";

export function ProtectedHeader() {
  const { userProfile } = useGetUserProfile();

  return (
    <Box px="6" py="3" style={{ borderBottom: "1px solid var(--gray-a5)" }}>
      <Flex align="center" justify="between">
        <Flex align="center" gap="6">
          <Flex align="center" gap="2">
            <Flex
              align="center"
              justify="center"
              width="28px"
              height="28px"
              style={{ backgroundColor: "var(--accent-9)", borderRadius: 6 }}
            >
              <FileTextIcon color="white" />
            </Flex>
            <Text size="3" weight="bold" style={{ letterSpacing: "0.05em" }}>
              SIMPLEINVOICE
            </Text>
          </Flex>

          <Flex align="center" gap="2">
            <Button variant="soft" size="2" asChild>
              <Link href="/">Invoices</Link>
            </Button>
            <Button variant="ghost" color="gray" size="2" asChild>
              <Link href="/invoices/new">New Invoice</Link>
            </Button>
          </Flex>
        </Flex>

        <Flex align="center" gap="4">
          <Button size="2" asChild>
            <Link href="/invoices/new">
              <PlusIcon /> New Invoice
            </Link>
          </Button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Flex
                align="center"
                gap="2"
                px="2"
                py="1"
                style={{ borderRadius: 6 }}
              >
                <Avatar
                  fallback={userProfile?.nickName?.[0] || ""}
                  size="1"
                  radius="full"
                />
                <Text size="2" color="gray">
                  {userProfile?.nickName}
                </Text>
              </Flex>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={(ev) => {
                  ev.stopPropagation();
                  logout()
                }}
              >
                Logout&nbsp;<ExitIcon />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Flex>
    </Box>
  );
}
