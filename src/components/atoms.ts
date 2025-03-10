import { User } from '@/types';
import { atom } from "jotai";

export const userAtom = atom<User | null | undefined>(undefined);
export const mobileAtom = atom<boolean | undefined>(undefined);
export const pwaAtom = atom<boolean | undefined>();