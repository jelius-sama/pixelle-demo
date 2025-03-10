"use client";

import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IsBooleanish, type Booleanish } from "@/types";
import { useFormStatus } from "react-dom";

type InputXPropsType = {
  pending?: boolean | "useFormStatus";
  isRequired: boolean;
  inputType: React.HTMLInputTypeAttribute;
  identifier: string | undefined;
  accept?: string;
  title?: string;
  placeholder?: string;
  endContent?: React.ReactElement;
  onInputValueChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  containerClassName?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  multiple?: boolean;
  value?: string | number | readonly string[];
};

const InputX = forwardRef<HTMLInputElement, InputXPropsType>(
  (
    {
      multiple,
      autoComplete,
      autoFocus,
      containerClassName,
      pending,
      isRequired,
      inputType,
      identifier,
      title,
      placeholder,
      endContent,
      accept,
      onInputValueChange,
      onKeyDown,
      value,
    },
    ref
  ) => {
    if (!IsBooleanish(isRequired)) {
      throw new Error(
        "isRequired prop provided to InputX Component is not Booleanish type."
      );
    }

    const { pending: formPending } = useFormStatus();

    return (
      <span className={containerClassName}>
        {title && (
          <Label
            htmlFor={identifier}
            aria-required={String(isRequired) as Booleanish}
          >
            {title}
          </Label>
        )}
        <span className="flex flex-row gap-x-2">
          <Input
            value={value}
            ref={ref}
            multiple={multiple}
            autoComplete={autoComplete ? autoComplete : identifier}
            autoFocus={autoFocus}
            onChange={onInputValueChange}
            onKeyDown={onKeyDown} // Passed the prop here
            accept={accept}
            className="flex-1"
            type={inputType}
            name={identifier}
            placeholder={placeholder}
            required={isRequired}
            aria-readonly={String(pending) as Booleanish}
            readOnly={pending === "useFormStatus" ? formPending : pending}
          />
          {endContent || <></>}
        </span>
      </span>
    );
  }
);

InputX.displayName = "InputX"; // Necessary when using forwardRef

export default InputX;
