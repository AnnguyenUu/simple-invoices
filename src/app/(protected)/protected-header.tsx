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
    <Box
      px={{ initial: "4", sm: "6" }}
      py="3"
      style={{ borderBottom: "1px solid var(--gray-a5)" }}
    >
      <Flex align="center" justify="between" wrap="wrap" gap="3">
        <Flex align="center" gap={{ initial: "3", sm: "6" }} wrap="wrap">
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
          </Flex>
        </Flex>

        <Flex align="center" gap={{ initial: "2", sm: "4" }}>
          <Button size="2" asChild>
            <Link href="/invoices/new">
              <PlusIcon />
              <Box display={{ initial: "none", xs: "inline" }} asChild>
                <span>New Invoice</span>
              </Box>
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
                <Box display={{ initial: "none", sm: "inline-block" }}>
                  <Text size="2" color="gray">
                    {userProfile?.nickName}
                  </Text>
                </Box>
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
