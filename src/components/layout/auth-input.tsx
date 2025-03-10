"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import InputX from "@/components/layout/input-x";
import Modal from "@/components/layout/modal";

export default function AuthInput({
  context,
  isPending,
}: {
  context: "sign-in" | "sign-up";
  isPending?: boolean;
}) {
  const formStatus = useFormStatus();
  const pending = isPending || formStatus.pending;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [banner, setBanner] = useState<{
    rawFile: File;
    modifiedFile: File | null;
  } | null>(null);
  const [avatar, setAvatar] = useState<{
    rawFile: File;
    modifiedFile: File | null;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<{
    avatarEdit: boolean | undefined;
    bannerEdit: boolean | undefined;
  }>({ bannerEdit: undefined, avatarEdit: undefined });

  const handleOnAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setAvatar({ rawFile: files[0], modifiedFile: null });
  };

  const handleOnBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setBanner({ rawFile: files[0], modifiedFile: null });
  };

  return (
    <React.Fragment>
      <InputX
        autoComplete="off"
        title="Email"
        placeholder="Email"
        isRequired={true}
        inputType="email"
        identifier="email"
        pending={pending}
      />

      <InputX
        autoComplete="off"
        title="Password"
        placeholder="Password"
        isRequired={true}
        inputType={!showPassword ? "password" : "text"}
        identifier="password"
        pending={pending}
        endContent={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                size={"icon"}
                className="rounded-full"
                variant={"outline"}
              >
                {!showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!showPassword ? "Show password" : "Hide Password"}</p>
            </TooltipContent>
          </Tooltip>
        }
      />

      {context === "sign-up" && (
        <React.Fragment>
          <InputX
            autoComplete="off"
            title="Confirm password"
            placeholder="Confirm password"
            isRequired={true}
            inputType={!showConfirmPassword ? "password" : "text"}
            identifier="confirm-password"
            pending={pending}
            endContent={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                    size={"icon"}
                    className="rounded-full"
                    variant={"outline"}
                  >
                    {!showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!showConfirmPassword
                      ? "Show confirm password"
                      : "Hide confirm Password"}
                  </p>
                </TooltipContent>
              </Tooltip>
            }
          />

          <InputX
            title="Username"
            placeholder="Username"
            isRequired={true}
            inputType="text"
            identifier="full_name"
            pending={pending}
          />

          <InputX
            autoComplete="off"
            title="Avatar"
            isRequired={false}
            inputType="file"
            identifier="avatar"
            accept="image/*"
            pending={pending}
            onInputValueChange={handleOnAvatarChange}
            endContent={
              <React.Fragment>
                {avatar && (
                  <React.Fragment>
                    <Modal
                      triggerElem={{ icon: <EditIcon /> }}
                      tooltip={{
                        text: "Edit",
                      }}
                      modal={{
                        title: "Edit",
                        description: "Edit your avatar for the best look.",
                        content: (
                          <div className="">
                            <p className="text-destructive">
                              Under Construction
                            </p>
                          </div>
                        ),
                        defaultCloseButton: {
                          mobile: "Cancel",
                          desktop: "Cancel",
                        },
                        setIsOpen: isModalOpen.avatarEdit,
                        footer: (
                          <Button
                            onClick={() =>
                              setIsModalOpen((rest) => ({
                                ...rest,
                                avatarEdit: false,
                              }))
                            }
                          >
                            Done
                          </Button>
                        ),
                      }}
                    />

                    <Modal
                      triggerElem={{ icon: <EyeIcon /> }}
                      tooltip={{
                        text: "Show avatar preview",
                      }}
                      modal={{
                        title: "Avatar preview",
                        description:
                          "See how your avatar would look like in your profile.",
                        content: (
                          <div className="border-[2px] flex place-content-center">
                            <img
                              className="aspect-square w-[50%] rounded-full object-cover"
                              src={URL.createObjectURL(
                                avatar.modifiedFile || avatar.rawFile
                              )}
                              alt="Banner preview"
                            />
                          </div>
                        ),
                        defaultCloseButton: {
                          mobile: false,
                          desktop: true,
                        },
                      }}
                    />
                  </React.Fragment>
                )}
              </React.Fragment>
            }
          />

          <InputX
            autoComplete="off"
            title="Banner"
            isRequired={false}
            inputType="file"
            accept="image/*"
            identifier="banner"
            pending={pending}
            onInputValueChange={handleOnBannerChange}
            endContent={
              <React.Fragment>
                {banner && (
                  <React.Fragment>
                    <Modal
                      triggerElem={{ icon: <EditIcon /> }}
                      tooltip={{
                        text: "Edit",
                      }}
                      modal={{
                        title: "Edit",
                        description: "Edit your banner for the best look.",
                        content: (
                          <div className="">
                            <p className="text-destructive">
                              Under Construction
                            </p>
                          </div>
                        ),
                        defaultCloseButton: {
                          mobile: "Cancel",
                          desktop: "Cancel",
                        },
                        setIsOpen: isModalOpen.bannerEdit,
                        footer: (
                          <Button
                            onClick={() =>
                              setIsModalOpen((rest) => ({
                                ...rest,
                                bannerEdit: false,
                              }))
                            }
                          >
                            Done
                          </Button>
                        ),
                      }}
                    />

                    <Modal
                      triggerElem={{ icon: <EyeIcon /> }}
                      tooltip={{
                        text: "Show banner preview",
                      }}
                      modal={{
                        title: "Banner preview",
                        description:
                          "See how your banner would look like in your profile.",
                        content: (
                          <div className="border-[2px]">
                            <img
                              className="aspect-[3/1] rounded-lg object-cover"
                              src={URL.createObjectURL(
                                banner.modifiedFile || banner.rawFile
                              )}
                              alt="Banner preview"
                            />
                          </div>
                        ),
                        defaultCloseButton: {
                          mobile: false,
                          desktop: true,
                        },
                      }}
                    />
                  </React.Fragment>
                )}
              </React.Fragment>
            }
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
