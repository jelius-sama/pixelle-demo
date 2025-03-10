import { clsx, type ClassValue } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ServerMessage } from "@/utils/Messages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFile(value: any): value is File {
  return value instanceof File;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function areFiles(value: any): value is File[] {
  // Check for FileList if it's defined (i.e., in a browser environment)
  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return true; // If it's a FileList, it's valid
  }

  // Check if it's an actual array of File objects
  return Array.isArray(value) && value.every(item => item instanceof File);
}

export function areBlobs(value: any): value is Blob[] {
  // Check if it's an array and every item is either a File or a Blob (since File extends Blob)
  return Array.isArray(value) && value.every(item => item instanceof Blob);
}

export function isBlob(value: any): value is Blob {
  return value instanceof Blob;
}


export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isStringArray(value: any): value is string[] {
  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed) && parsed.every(item => typeof item === 'string');
  } catch (error) {
    return false;
  }
}

export function isNumber(value: any): value is number {
  return typeof value === "number";
}

export function encodedRedirect<T extends string>({
  type,
  path,
  params,
}: {
  type: T;
  path: string;
  params: { [key in T]: string } & Record<string, string>;
}): never {
  const queryParams = new URLSearchParams({
    [type]: params[type],
    ...params,
  }).toString();

  return redirect(`${path}?${queryParams}`);
}


export function toastToClient({ path, serverMessage, status }: { status: ServerMessage['status']; path?: string; serverMessage: ServerMessage['msg']; },): never {

  return path ? redirect(`${path}?serverMessage=${serverMessage}&status=${status}`) : redirect(`?serverMessage=${serverMessage}&status=${status}`);
}


export function delay(ms: number): void {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // This loop will block execution for the specified time
  }
}

export function asyncDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
