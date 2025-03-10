"use client";

import React, { Fragment, useRef, useState } from "react";
import InputX from "@/components/layout/input-x";
import { AlertCircle, EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/layout/modal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isFile, isString } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ActivityIndicator from "@/components/ui/activity-indicator";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function EditProfileForm() {
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [closeModal, setCloseModal] = useState(true);

  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null);
  const currentPasswordRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [oldpassword, setOldPassword] = useState<string>("");

  const router = useRouter();

  const handleOnAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setAvatar({ rawFile: files[0], modifiedFile: null });
  };

  const handleOnBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) setBanner({ rawFile: files[0], modifiedFile: null });
  };

  const validate = ({
    data,
    dataTypeBe,
  }: {
    data: string | File;
    dataTypeBe: "string" | "file";
  }): boolean => {
    return dataTypeBe === "string"
      ? isString(data)
        ? true
        : false
      : dataTypeBe === "file" && isFile(data)
      ? true
      : false;
  };

  const handleSubmit = async () => {
    const toastLoadingId = "PENDING";
    toast.loading("Updating your profile", { id: toastLoadingId });
    setPending(true);
    setCloseModal(false);

    if (!formRef.current) {
      setError("Something went wrong!");
      setPending(false);
      toast.dismiss(toastLoadingId);
      setCloseModal(true);
      return;
    }
    const formData = new FormData(formRef.current);

    if (usernameRef.current && usernameRef.current.value !== "") {
      const noIssues = validate({
        data: usernameRef.current.value,
        dataTypeBe: "string",
      });
      if (!noIssues) {
        setError("Username should be a valid string!");
        setPending(false);
        toast.dismiss(toastLoadingId);
        setCloseModal(true);
        return;
      }
    } else {
      formData.delete("new_full_name");
    }

    if (passwordRef.current && passwordRef.current.value !== "") {
      if (!passwordConfirmRef.current) {
        setError("Please confirm your new password before continuing!");
        setPending(false);
        toast.dismiss(toastLoadingId);
        setCloseModal(true);
        return;
      }
      if (passwordConfirmRef.current.value !== passwordRef.current.value) {
        setError("Your password confirmation does not match!");
        setPending(false);
        toast.dismiss(toastLoadingId);
        setCloseModal(true);
        return;
      }

      if (currentPasswordRef.current) {
        const noIssues = validate({
          data: currentPasswordRef.current.value,
          dataTypeBe: "string",
        });

        if (!noIssues) {
          setError("Password should be a valid string!");
          setPending(false);
          toast.dismiss(toastLoadingId);
          setCloseModal(true);
          return;
        }
      }

      const noIssues = validate({
        data: passwordRef.current.value,
        dataTypeBe: "string",
      });
      if (!noIssues) {
        setError("Password should be a valid string!");
        setPending(false);
        toast.dismiss(toastLoadingId);
        setCloseModal(true);
        return;
      }
    } else {
      formData.delete("new_password");
      formData.delete("confirm_new_password");
      formData.delete("old_password");
    }

    if (
      avatarRef.current &&
      avatarRef.current.files &&
      avatarRef.current.files.length > 0
    ) {
      const noIssues = validate({
        data: avatarRef.current.files[0],
        dataTypeBe: "file",
      });

      if (!noIssues) {
        toast.dismiss(toastLoadingId);
        setError("Please select a valid non-corrupted image for your avatar!");
        setPending(false);
        setCloseModal(true);
        return;
      }
    } else {
      formData.delete("new_avatar");
    }

    if (
      bannerRef.current &&
      bannerRef.current.files &&
      bannerRef.current.files.length > 0
    ) {
      const noIssues = validate({
        data: bannerRef.current.files[0],
        dataTypeBe: "file",
      });

      if (!noIssues) {
        toast.dismiss(toastLoadingId);
        setError("Please select a valid non-corrupted image for your banner!");
        setPending(false);
        setCloseModal(true);
        return;
      }
    } else {
      formData.delete("new_banner");
    }

    const response = await fetch("/api/edit-profile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log("Response: ", response);
      setError("Something went wrong!");
      setPending(false);
      setCloseModal(true);
      toast.dismiss(toastLoadingId);
      return;
    } else {
      if (response.status !== 200) {
        console.log("Response: ", response);
        setError("Something went wrong!");
        setCloseModal(true);
        toast.dismiss(toastLoadingId);
        setPending(false);
        return;
      }
    }

    setCloseModal(true);
    toast.dismiss(toastLoadingId);
    setPending(false);
    toast("Successfully updated your profile!", {
      action: {
        label: "Visit profile",
        onClick: () => router.push("/profile"),
      },
    });
  };

  return (
    <Card className="w-full md:max-w-[40%]">
      <CardContent className="flex flex-col items-center justify-center">
        <form
          ref={formRef}
          className="w-full flex flex-col items-center justify-center gap-y-4 py-8  "
        >
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <InputX
            ref={usernameRef}
            autoComplete="off"
            pending={pending}
            isRequired={false}
            inputType={"text"}
            identifier={"new_full_name"}
            title="New Username"
            placeholder="New Username"
            containerClassName="w-full"
          />
          <InputX
            containerClassName="w-full"
            ref={passwordRef}
            value={password}
            onInputValueChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            title="New Password"
            placeholder="New Password"
            isRequired={false}
            inputType={!showPassword ? "password" : "text"}
            identifier="new_password"
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
          <InputX
            ref={passwordConfirmRef}
            autoComplete="off"
            value={confirmPassword}
            onInputValueChange={(e) => setConfirmPassword(e.target.value)}
            title="Confirm New Password"
            containerClassName="w-full"
            placeholder="Confirm New Password"
            isRequired={password === "" ? false : true}
            inputType={!showConfirmPassword ? "password" : "text"}
            identifier={"confirm_new_password"}
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
            ref={currentPasswordRef}
            autoComplete="off"
            title="Old Password"
            containerClassName="w-full"
            placeholder="Old Password"
            isRequired={password === "" ? false : true}
            inputType={!showCurrentPassword ? "password" : "text"}
            identifier={"old_password"}
            value={oldpassword}
            onInputValueChange={(e) => setOldPassword(e.target.value)}
            pending={pending}
            endContent={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    type="button"
                    size={"icon"}
                    className="rounded-full"
                    variant={"outline"}
                  >
                    {!showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {!showCurrentPassword
                      ? "Show current password"
                      : "Hide current Password"}
                  </p>
                </TooltipContent>
              </Tooltip>
            }
          />
          <InputX
            ref={avatarRef}
            containerClassName="w-full"
            autoComplete="off"
            title="New Avatar"
            isRequired={false}
            inputType="file"
            identifier="new_avatar"
            accept="image/*"
            multiple={false}
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
            ref={bannerRef}
            containerClassName="w-full"
            multiple={false}
            autoComplete="off"
            title="New Banner"
            isRequired={false}
            inputType="file"
            accept="image/*"
            identifier="new_banner"
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

          <Modal
            triggerElem={
              <Button
                disabled={
                  password === ""
                    ? false
                    : confirmPassword === "" || oldpassword === ""
                    ? true
                    : false
                }
                type="button"
              >
                Save changes
              </Button>
            }
            modal={{
              title: "Enter your password to continue.",
              description:
                "For security measure we need you to enter your password to make any changes to your profile.",
              content: <PasswordConfirmationForm handleSubmit={handleSubmit} />,
              defaultCloseButton: {
                mobile: false,
                desktop: false,
              },
              setIsOpen: !closeModal,
            }}
          />
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordConfirmationForm({
  handleSubmit,
}: {
  handleSubmit: () => Promise<void>;
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const backgroundColor = useThemeColor("background");

  const authenticate = async () => {
    setIsPending(true);
    setError(null);
    const password = passwordRef.current?.value;

    if (!password) {
      setError("Password cannot be empty.");
      setIsPending(false);
      return;
    }

    if (!isString(password)) {
      setError("Password should be a valid string!");
      setIsPending(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", password);

      const res = await fetch("/api/confirm-password", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as {
        error: string | undefined;
        message: string | undefined;
      };

      if (!res.ok) {
        console.log(`An error occurred: ${data.error}`);
        throw new Error("An error occurred");
      }

      await handleSubmit();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Fragment>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-end w-full gap-x-2">
        <InputX
          containerClassName="w-full"
          ref={passwordRef}
          pending={isPending}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              authenticate();
            }
          }}
          isRequired={true}
          title="Enter your password"
          placeholder="Password"
          inputType="password"
          identifier="password"
        />

        <Button
          onClick={() => authenticate()}
          aria-disabled={isPending}
          disabled={isPending}
          type="button"
        >
          {isPending && <ActivityIndicator size={36} color={backgroundColor} />}
          Enter
        </Button>
      </div>
    </Fragment>
  );
}
