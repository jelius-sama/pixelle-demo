"use client";

import React, { useEffect, useRef, useState } from "react";
import InputX from "@/components/layout/input-x";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { useWorkload } from "@/components/global-workload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ART_TYPE, ART_TYPE_LABELS } from "@/server/database/schema";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useDeviceType from "@/hooks/useDeviceType";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function PostView() {
  const { post, postUploading } = useWorkload();
  const [shouldShowAlert, setShouldShowAlert] = useState(postUploading);
  const [artType, setArtType] = useState<string | null>(null);
  const [artTags, setArtTags] = useState<string[]>([]);
  const artTypeInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    if (postUploading) return;

    setShouldShowAlert(postUploading);
  }, [postUploading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (artType === null) {
      toast.error("Fill out the Form before submitting!");
      return;
    }
    if (artTags.length < 0) {
      toast.error("You forgot to add tags to your Artwork");
    }

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("artwork_type", artType);
    formData.append("tags", JSON.stringify(artTags));
    await post(formData);
  };

  const addTag = () => {
    const inputEl = artTypeInputRef.current;
    if (!inputEl || !inputEl.value) return;

    setArtTags((prev) => {
      if (prev.includes(inputEl.value)) return prev; // Avoid duplicates
      return [...prev, inputEl.value];
    });

    inputEl.value = ""; // Clear input after adding
  };

  return (
    <Card className="w-full md:max-w-[40%]">
      <CardContent className="flex flex-col items-center justify-center">
        {shouldShowAlert && (
          <Alert variant="destructive" className="w-full max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Wait for the previous upload to finish before uploading a new
              artwork.
            </AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center justify-center gap-y-4 py-8  "
        >
          <InputX
            pending={postUploading}
            isRequired={true}
            inputType={"text"}
            identifier={"title"}
            title="Title"
            containerClassName="w-full"
          />
          <span className="w-full">
            <Label className="w-full self-start">Artwork Type</Label>
            <Select
              disabled={postUploading}
              onValueChange={(value) => setArtType(value)}
              required={true}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your Artwork's type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Artwork Type</SelectLabel>
                  {ART_TYPE.map((t) => (
                    <SelectItem key={t} value={t}>
                      {ART_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>

          <div className="flex w-full items-end space-x-2">
            <InputX
              ref={artTypeInputRef}
              pending={postUploading}
              isRequired={false}
              inputType={"text"}
              identifier={undefined}
              title="Tags"
              containerClassName="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  addTag();
                }
              }}
            />
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => addTag()}
            >
              Add
            </Button>
          </div>
          <div className="w-full">
            Tags:{" "}
            {artTags.length > 0 ? (
              artTags.map((tag, index) => (
                <span key={index} className="mx-2 mb-2 relative">
                  <Button type="button" size={"chip"} variant="secondary">
                    {tag}
                  </Button>
                  <Button
                    disabled={postUploading}
                    onClick={() => {
                      if (postUploading) return;
                      setArtTags((prev) => prev.filter((t) => t !== tag));
                    }}
                    type="button"
                    className="absolute rounded-full size-4 [&_svg]:size-4 -top-3 -right-3 px-3 py-3"
                    size={"chip"}
                    variant={"destructive"}
                  >
                    <X size={4} />
                  </Button>
                </span>
              ))
            ) : (
              <span className="text-destructive">No Tags Added.</span>
            )}
          </div>
          <InputX
            pending={postUploading}
            isRequired={false}
            inputType={"text"}
            identifier={"description"}
            title="Description"
            containerClassName="w-full"
          />
          <InputX
            ref={imageInputRef}
            pending={postUploading}
            isRequired={true}
            inputType={"file"}
            accept="image/*"
            multiple={true}
            identifier={"images"}
            title="Images"
            containerClassName="w-full"
          />
          {isMobile ? (
            <div className="w-full flex items-center justify-between">
              <ImagePreviewModal
                isMobile={isMobile}
                imageInputRef={imageInputRef}
              />
              <SubmitButton loading={postUploading}>Submit</SubmitButton>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between">
              <ImagePreviewModal
                isMobile={isMobile}
                imageInputRef={imageInputRef}
              />
              <div className="ml-auto">
                <SubmitButton loading={postUploading}>Submit</SubmitButton>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function ImagePreviewModal({
  imageInputRef,
  isMobile,
}: {
  isMobile: boolean;
  imageInputRef: React.MutableRefObject<HTMLInputElement | null>;
}) {
  const [open, setOpen] = React.useState(false);
  const [images, setImages] = useState<File[]>([]);
  const title = "Preview";
  const description = "See how your images would look like.";

  useEffect(() => {
    if (open && imageInputRef.current && imageInputRef.current.files) {
      setImages(Array.from(imageInputRef.current.files));
      return;
    }
  }, [open]);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="flex-1 flex justify-center">
          <DrawerTrigger asChild>
            <Button type="button" variant="secondary">
              Preview images
            </Button>
          </DrawerTrigger>
        </div>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <ImagePreviewCarousel images={images} className="px-4" />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button type="button" variant="secondary">
                Done
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <DialogTrigger asChild>
          <Button type="button" variant="secondary">
            Preview images
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ImagePreviewCarousel images={images} />
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImagePreviewCarousel({
  className,
  images,
}: {
  className?: string;
  images: File[];
}) {
  return (
    <section className={cn("grid items-start justify-center gap-4", className)}>
      {images.length > 0 ? (
        <Carousel className="w-full max-w-xs">
          <CarouselContent className=" flex items-center">
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center pt-6">
                      <Image
                        src={URL.createObjectURL(image)}
                        height={500}
                        width={500}
                        alt="Preview"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <span>No image selected, select images first to preview them.</span>
      )}
    </section>
  );
}
