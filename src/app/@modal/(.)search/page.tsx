"use client";

import { mobileAtom } from '@/components/atoms';
import InputX from '@/components/layout/input-x';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import MarginedContent from '@/components/ui/margined-content';
import { SubmitButton } from '@/components/ui/submit-button';
import { asyncDelay, isString } from '@/utils';
import { atom, getDefaultStore, useAtom, useAtomValue } from 'jotai';
import { AlertCircle, SearchIcon, XIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const searchDataAtom = atom<{
    query: string | { error: string; },
    placeholder: string | { error: string; };
}>({
    query: '',
    placeholder: ''
});
const store = getDefaultStore();

export default function SearchModal() {
    const [isModalOpen, setIsModalOpen] = React.useState<boolean | undefined>(undefined);
    const router = useRouter();
    const mobile = useAtomValue(mobileAtom);
    const [searchData, setSearchData] = useAtom(searchDataAtom);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/search') setIsModalOpen(true);

        (async () => {
            const res = await fetch(`/api/search/placeholder-tip`, { method: "GET" });

            if (!res.ok) {
                setSearchData((prev) => ({ query: prev.query, placeholder: { error: 'Failed to fetch search tip!' } }));
            }

            const { tip } = await res.json() as { tip: string; };

            // Validate the structure of the response
            if (!tip) {
                setSearchData((prev) => ({ query: prev.query, placeholder: { error: 'Failed to fetch search tip!' } }));
            } else {
                setSearchData((prev) => ({ query: prev.query, placeholder: tip }));
            }
        })();
    }, [pathname]);

    const handleOnOpenChange = async (open: boolean) => {
        if (open) return;

        setIsModalOpen(open);
        await asyncDelay(300);
        router.back();
    };

    const performSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('search-query');
        const sanitizedQuery = isString(query) && String(query);

        if (!sanitizedQuery) {
            setSearchData((prev) => ({ placeholder: prev.placeholder, query: { error: "Search input should be a string!" } }));
            return;
        }

        setSearchData((prev) => ({ placeholder: prev.placeholder, query: sanitizedQuery }));
        setIsModalOpen(false);
        await asyncDelay(300);

        if (isString(store.get(searchDataAtom).query)) {
            router.push(`/search/${encodeURIComponent(store.get(searchDataAtom).query as string)}`);
        }
    };

    return mobile ? (
        <Drawer snapPoints={[0.95]} activeSnapPoint={0.95} repositionInputs={false} defaultOpen={true} closeThreshold={0.45} open={isModalOpen} onOpenChange={handleOnOpenChange}>
            <DrawerContent className='h-full'>
                <DrawerHeader className="w-full flex flex-row relative my-2">
                    <DrawerTitle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        Search
                    </DrawerTitle>
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 size-7 [&_svg]:size-4 rounded-full"
                            size="icon"
                        >
                            <XIcon />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <MarginedContent removeTopMargin={true}>
                    <form onSubmit={performSearch} className='flex flex-row gap-x-2 mb-4 items-end w-full'>
                        <InputX
                            autoFocus={true}
                            containerClassName='flex-1'
                            pending={false}
                            isRequired={true}
                            inputType={'text'}
                            identifier={'search-query'}
                            placeholder={isString(searchData.placeholder) ? searchData.placeholder.length >= 1 ? `eg.: ${searchData.placeholder}` : searchData.placeholder : ''}
                        />
                        <SubmitButton><SearchIcon /></SubmitButton>
                    </form>

                    {!isString(searchData.query) && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {searchData.query.error}
                            </AlertDescription>
                        </Alert>
                    )}
                </MarginedContent>
            </DrawerContent>
        </Drawer>
    ) : (
        <Dialog open={isModalOpen} onOpenChange={handleOnOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Search</DialogTitle>
                </DialogHeader>
                <form onSubmit={performSearch} className='flex flex-row gap-x-2 items-end w-full'>
                    <InputX
                        autoFocus={true}
                        containerClassName='flex-1'
                        pending={false}
                        isRequired={true}
                        inputType={'text'}
                        identifier={'search-query'}
                        placeholder={isString(searchData.placeholder) ? searchData.placeholder.length >= 1 ? `eg.: ${searchData.placeholder}` : searchData.placeholder : ''}
                    />
                    <SubmitButton><SearchIcon /></SubmitButton>
                </form>

                {!isString(searchData.query) && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {searchData.query.error}
                        </AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    );
}
