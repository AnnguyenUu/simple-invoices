"use client";

import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { IconButton, TextField } from "@radix-ui/themes";

type InputPasswordProps = Omit<
  ComponentPropsWithoutRef<typeof TextField.Root>,
  "type"
>;

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  function InputPassword(props, ref) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <TextField.Root
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
      >
        <TextField.Slot side="right">
          <IconButton
            type="button"
            size="1"
            variant="ghost"
            color="gray"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </IconButton>
        </TextField.Slot>
      </TextField.Root>
    );
  }
);
