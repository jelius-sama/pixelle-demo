"use client";

import { useAtomValue } from "jotai";
import React, {
  ReactNode,
  useEffect,
  useState,
  type ReactElement,
} from "react";
import { mobileAtom } from "@/components/atoms";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
import MarginedContent from "@/components/ui/margined-content";

type ModalPropsType = {
  triggerElem: { icon: ReactElement } | ReactElement;

  tooltip?: {
    text: string;
  };

  modal: {
    title: string;
    description?: string;
    content: ReactElement;
    footer?: ReactElement;
    defaultCloseButton: {
      mobile: boolean | string;
      desktop: boolean | string;
    };
    setIsOpen?: boolean;
  };
};

export default function Modal({ tooltip, modal, triggerElem }: ModalPropsType) {
  const mobile = useAtomValue(mobileAtom);
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof modal.setIsOpen === "undefined") return;
    setIsOpen(modal.setIsOpen);
  }, [modal.setIsOpen]);

  return (
    <React.Fragment>
      {!mobile ? (
        <Dialog
          open={isOpen}
          onOpenChange={(isOpen) => {
            setIsOpen(isOpen);
            modal.setIsOpen = isOpen;
          }}
        >
          {tooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  {"icon" in triggerElem ? (
                    <Button
                      type="button"
                      size={"icon"}
                      className="rounded-full"
                      variant={"outline"}
                    >
                      {triggerElem.icon}
                    </Button>
                  ) : (
                    <DialogTrigger asChild>{triggerElem}</DialogTrigger>
                  )}
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip.text}</p>
              </TooltipContent>
            </Tooltip>
          ) : "icon" in triggerElem ? (
            <DialogTrigger asChild>
              <Button
                type="button"
                size={"icon"}
                className="rounded-full"
                variant={"outline"}
              >
                {triggerElem.icon}
              </Button>
            </DialogTrigger>
          ) : (
            <DialogTrigger asChild>{triggerElem}</DialogTrigger>
          )}

          <DialogContent className="max-w-[40%]">
            <DialogHeader className="flex flex-row w-full items-start space-y-0">
              <span className="flex flex-1 flex-col items-start gap-x-2">
                <DialogTitle>{modal.title}</DialogTitle>
                {modal.description && (
                  <DialogDescription>{modal.description}</DialogDescription>
                )}
              </span>
              <DialogClose asChild>
                <Button variant={"outline"} size={"icon"} className={"w-7 h-7"}>
                  <X />
                </Button>
              </DialogClose>
            </DialogHeader>

            {modal.content}

            {modal.defaultCloseButton.desktop ? (
              <DialogFooter>
                {modal.footer || <></>}
                <DialogClose asChild>
                  <Button type="button">
                    {typeof modal.defaultCloseButton.desktop === "string"
                      ? modal.defaultCloseButton.desktop
                      : "Close"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            ) : (
              modal.footer && <DialogFooter>{modal.footer}</DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={isOpen}
          onOpenChange={(isOpen) => {
            setIsOpen(isOpen);
            modal.setIsOpen = isOpen;
          }}
        >
          <DrawerTrigger asChild>
            {"icon" in triggerElem ? (
              <Button
                type="button"
                size={"icon"}
                className="rounded-full"
                variant={"outline"}
              >
                {triggerElem.icon}
              </Button>
            ) : (
              <DialogTrigger asChild>{triggerElem}</DialogTrigger>
            )}
          </DrawerTrigger>
          <DrawerContent className="max-h-[40%] pb-10">
            <DrawerHeader className="flex flex-row w-full items-start space-y-0">
              <span className="flex flex-1 flex-col items-start gap-x-2">
                <DrawerTitle>{modal.title}</DrawerTitle>
                {modal.description && (
                  <DrawerDescription>{modal.description}</DrawerDescription>
                )}
              </span>

              <DrawerClose asChild>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className={"w-8 h-8 rounded-full"}
                >
                  <X />
                </Button>
              </DrawerClose>
            </DrawerHeader>

            <MarginedContent className="!pt-0">{modal.content}</MarginedContent>

            {modal.defaultCloseButton.mobile ? (
              <DrawerFooter>
                {modal.footer || <></>}
                <DrawerClose asChild>
                  <Button type="button">
                    {typeof modal.defaultCloseButton.mobile === "string"
                      ? modal.defaultCloseButton.mobile
                      : "Close"}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            ) : (
              modal.footer && <DrawerFooter>{modal.footer}</DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </React.Fragment>
  );
}
