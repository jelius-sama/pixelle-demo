"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ART_TYPE, ART_TYPE_LABELS } from "@/server/database/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrowseSearchParams } from "./page";
import { cssVars } from "@/app.config";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ArtCard, { ArtCardSkeleton } from "@/components/layout/art-card";
import { ArtworkWithUserName } from "@/server/database/fetchUserMetadata";
import { userAtom } from "@/components/atoms";
import { useAtomValue } from "jotai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InfoIcon, MessageCircleIcon, X } from "lucide-react";
import React from "react";
import InputX from "@/components/layout/input-x";
import { Button } from "@/components/ui/button";

export function TabContent({ searchParams }: { searchParams: BrowseSearchParams }) {
    const tab = searchParams?.tab === "genre" ? "genre" : "tags";

    return (
        <div className="w-full h-full flex flex-nowrap flex-col gap-y-4 mt-4" role="tabpanel" id={`panel-${tab}`}>
            {tab === "genre" && (
                <BrowseGenre />
            )}

            {tab === "tags" && (
                <BrowseTags />
            )}
        </div>
    );
}

function BrowseGenre() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAtomValue(userAtom);
    const urlParams = useSearchParams();
    const [genreArtworks, setGenreArtworks] = useState<ArtworkWithUserName[]>([]);
    const [isFetchingGenre, setIsFetchingGenre] = useState(false);
    const [genreFetchError, setGenreFetchError] = useState<string | null>(null);
    const selectedGenreFilters = useMemo(() => urlParams.get("genre")?.split(",") || [], [urlParams]);


    const fetchGenreArtworks = useCallback(async (genres: string[]) => {
        if (!genres.length) {
            setGenreArtworks([]);
            return;
        }

        setIsFetchingGenre(true);
        setGenreFetchError(null);
        try {
            const res = await fetch("/api/browse", {
                method: "POST",
                body: JSON.stringify({
                    browse: { genre: genres },
                    pagination: { page: 1, limit: 20 }
                })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to fetch artworks");

            setGenreArtworks(data.data || []);
        } catch (err: any) {
            setGenreFetchError(err.message);
        } finally {
            setIsFetchingGenre(false);
        }
    }, []);

    const updateGenreQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(urlParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        return params.toString();
    }, [urlParams]);



    useEffect(() => {
        fetchGenreArtworks(selectedGenreFilters);
    }, [selectedGenreFilters, fetchGenreArtworks]);

    return (
        <React.Fragment>
            <ToggleGroup
                defaultValue={selectedGenreFilters}
                onValueChange={(val: string[]) => {
                    const queryString = updateGenreQueryString("genre", val.join(","));
                    router.push(pathname + "?" + queryString);
                }}
                type="multiple"
                variant="outline"
            >
                {ART_TYPE.map((t) => (
                    <ToggleGroupItem size="sm" key={ART_TYPE_LABELS[t]} value={t}>
                        {ART_TYPE_LABELS[t]}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            <ScrollArea className="w-full h-full mb-4 rounded-md border" style={{ padding: `${cssVars.marginPx}px` }}>
                {isFetchingGenre ? (
                    <section className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))]  md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-1">
                        {Array.from({ length: 21 }).map((_, index) => (
                            <ArtCardSkeleton key={index} />
                        ))}
                    </section>
                ) : genreFetchError ? (
                    <div className="w-full flex items-center justify-center">
                        <Alert variant="destructive" className="w-full max-w-sm">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {genreFetchError}
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : selectedGenreFilters.length <= 0 ? (
                    <div className="w-full flex items-center justify-center">
                        <Alert variant={"default"} className="w-full max-w-sm">
                            <MessageCircleIcon className="h-4 w-4" />
                            <AlertTitle>Message</AlertTitle>
                            <AlertDescription>
                                Select any genre to browse.
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : genreArtworks.length === 0 ? (
                    <div className="w-full flex items-center justify-center">
                        <Alert variant={"default"} className="w-full max-w-sm">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Info</AlertTitle>
                            <AlertDescription>
                                No Artworks found!
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <section className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-1">
                        {genreArtworks.map((artwork, index) => <ArtCard artwork={artwork} key={index} userId={user ? user.id : null} />)}
                    </section>
                )}
            </ScrollArea>
        </React.Fragment>
    )
}


function BrowseTags() {
    const router = useRouter();
    const pathname = usePathname();
    const urlParams = useSearchParams();
    const user = useAtomValue(userAtom);
    const artTypeInputRef = useRef<HTMLInputElement | null>(null);

    const [tagArtworks, setTagArtworks] = useState<ArtworkWithUserName[]>([]);
    const [isFetchingTags, setIsFetchingTags] = useState(false);
    const [tagFetchError, setTagFetchError] = useState<string | null>(null);

    const selectedTagFilters = useMemo(() => urlParams.get("tags")?.split(",") || [], [urlParams]);

    const updateTagQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(urlParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        return params.toString();
    }, [urlParams]);

    const fetchTagArtworks = useCallback(async (tags: string[]) => {
        if (!tags.length) {
            setTagArtworks([]);
            return;
        }

        setIsFetchingTags(true);
        setTagFetchError(null);
        try {
            const res = await fetch("/api/browse", {
                method: "POST",
                body: JSON.stringify({
                    browse: { tags },
                    pagination: { page: 1, limit: 20 }
                })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to fetch artworks");

            setTagArtworks(data.data || []);
        } catch (err: any) {
            setTagFetchError(err.message);
        } finally {
            setIsFetchingTags(false);
        }
    }, []);

    useEffect(() => {
        fetchTagArtworks(selectedTagFilters);
    }, [selectedTagFilters, fetchTagArtworks]);

    const addTag = () => {
        const inputEl = artTypeInputRef.current;
        if (!inputEl || !inputEl.value) return;

        const newTag = inputEl.value.trim();
        if (!newTag || selectedTagFilters.includes(newTag)) return;

        const updatedTags = [...selectedTagFilters, newTag];
        const queryString = updateTagQueryString("tags", updatedTags.join(","));
        router.push(pathname + "?" + queryString);

        inputEl.value = ""; // Clear input after adding
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = selectedTagFilters.filter(tag => tag !== tagToRemove);
        const queryString = updateTagQueryString("tags", updatedTags.join(","));
        router.push(pathname + "?" + queryString);
    };

    return (
        <React.Fragment>
            <div className="w-full flex items-center justify-center flex-nowrap flex-col gap-y-3">
                <div className="flex w-full max-w-md items-end space-x-2">
                    <InputX
                        ref={artTypeInputRef}
                        isRequired={false}
                        inputType={"text"}
                        identifier={undefined}
                        placeholder="Add Tags"
                        containerClassName="w-full"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addTag();
                            }
                        }}
                    />
                    <Button variant={"secondary"} type="button" onClick={addTag}>
                        Add
                    </Button>
                </div>
                <div className="w-full max-w-md">
                    Tags:{" "}
                    {selectedTagFilters.length > 0 ? (
                        selectedTagFilters.map((tag, index) => (
                            <span key={index} className="mx-2 mb-2 relative">
                                <Button type="button" size={"chip"} variant="secondary">
                                    {tag}
                                </Button>
                                <Button
                                    onClick={() => removeTag(tag)}
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
            </div>

            <ScrollArea className="w-full h-full mb-4 rounded-md border" style={{ padding: `${cssVars.marginPx}px` }}>
                {isFetchingTags ? (
                    <section className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-1">
                        {Array.from({ length: 21 }).map((_, index) => (
                            <ArtCardSkeleton key={index} />
                        ))}
                    </section>
                ) : tagFetchError ? (
                    <div className="w-full flex items-center justify-center">
                        <Alert variant="destructive" className="w-full max-w-sm">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{tagFetchError}</AlertDescription>
                        </Alert>
                    </div>
                ) : selectedTagFilters.length <= 0 ? (
                    <div className="w-full flex items-center justify-center">
                        <Alert variant={"default"} className="w-full max-w-sm">
                            <MessageCircleIcon className="h-4 w-4" />
                            <AlertTitle>Message</AlertTitle>
                            <AlertDescription>Select any tag to browse.</AlertDescription>
                        </Alert>
                    </div>
                ) : tagArtworks.length === 0 ? (
                    <div className="w-full flex items-center justify-center">
                        <Alert variant={"default"} className="w-full max-w-sm">
                            <InfoIcon className="h-4 w-4" />
                            <AlertTitle>Info</AlertTitle>
                            <AlertDescription>No artworks found!</AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <section className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-1">
                        {tagArtworks.map((artwork, index) => (
                            <ArtCard artwork={artwork} key={index} userId={user ? user.id : null} />
                        ))}
                    </section>
                )}
            </ScrollArea>
        </React.Fragment>
    );
}
