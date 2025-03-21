"use server";

import { ArtWork, List, ListItem, PredefinedList, UUID } from "@/server/database/schema";
import { createServerClient } from "@/server/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { ArtworkWithUserName, fetchArtistUserName } from "./fetchUserMetadata";

export interface ListMetadata {
    listId: "likes" | "dislikes" | (string & {});
    listTitle: string;
    listThumb: string;
    totalItems: number;
}

interface ListItemWithArtworkData extends Omit<Omit<Omit<ListItem, "added_at">, "list_id">, "artwork_id"> {
    artwork: ArtworkWithUserName;
}

export interface ListItemWithMetadata extends Omit<Omit<List, "created_at">, "updated_at"> {
    items: ListItemWithArtworkData[] | null;
}

type StripedArtworkData<T = PredefinedList[]> = {
    artwork_id: UUID;
    likes: T;
    dislikes: T;
    images: {
        bucket: string,
        path: string
    }[];
};

export async function fetchListsMetadata(userId: UUID): Promise<{ predefined: ListMetadata[]; userDefined: ListMetadata[]; }> {
    const supabase = createServerClient();

    // Helper function to query and parse data
    async function fetchStripedArtworkData(column: "likes" | "dislikes"): Promise<StripedArtworkData[] | null> {
        const { data, error }: { data: StripedArtworkData[] | null; error: PostgrestError | null; } = await supabase
            .from("artworks")
            .select(`id, ${column}, images`, { count: "exact" })
            .filter(column, "cs", JSON.stringify([{ uid: userId }])) as { data: StripedArtworkData[] | null, error: PostgrestError | null; };

        if (error) {
            console.error(`Error fetching ${column} data:`, error);
            return null;
        }

        return data;
    }

    // Helper function to query and parse data
    async function fetchUserDefinedLists(): Promise<List[] | null> {
        const { data, error }: { data: List[] | null; error: PostgrestError | null; } = await supabase
            .from("lists")
            .select("*")
            .eq("belongs_to", userId) as { data: List[] | null, error: PostgrestError | null; };

        if (error) {
            console.error(`Error fetching data:`, error);
            return null;
        }

        return data;
    }

    // Helper function to get list items for user defined lists
    async function getListItemsForUserDefinedLists(list_id: string): Promise<ListItem[] | null> {
        const { data, error }: { data: ListItem[] | null; error: PostgrestError | null; } = await supabase
            .from("list_items")
            .select("artwork_id, added_at", { count: "exact" })
            .eq("list_id", list_id) as { data: ListItem[] | null, error: PostgrestError | null; };

        if (error) {
            console.error(`Error fetching data:`, error);
            return null;
        }

        return data;
    }

    // Helper function to get the latest thumbnail
    async function getLatestThumbnail(data: { predefinedList?: StripedArtworkData[] | null, userDefinedList?: ListItem[] | null; }, column?: "likes" | "dislikes"): Promise<string> {
        if ((!data.predefinedList || data.predefinedList.length === 0) && (!data.userDefinedList || data.userDefinedList.length === 0)) return "";

        if (column && data.predefinedList) {
            // Extract and sort interactions based on the timestamp
            const latestInteraction = data.predefinedList
                .flatMap((artwork) => {
                    const interactions = artwork[column] as PredefinedList[];

                    return interactions
                        .filter((entry) => entry.uid === userId)
                        .map((entry) => ({
                            timestamp: entry.timestamp,
                            image: `/api/proxy?url=${"object/public/" + artwork.images[0].bucket + "/" + artwork.images[0].path}` || "", // Use the first image as the thumbnail
                        }));
                })
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            return latestInteraction.image || "";
        } else {
            if (!data.userDefinedList) return "";
            const latestItem = data.userDefinedList
                .sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())[0];

            if (!latestItem) {
                return "";
            }

            // Fetch the artwork data for the `artwork_id` of the latest item
            const { data: artworkData, error } = await supabase
                .from("artworks")
                .select("images")
                .eq("id", latestItem.artwork_id)
                .single();

            if (error) {
                console.log("Something went wrong when fetching thumbnail for user defined list: ", error);
                return "";
            }

            return artworkData ? `/api/proxy?url=${"object/public/" + artworkData.images[0].bucket + "/" + artworkData.images[0].path}` : "";
        }
    }

    // Fetch data for likes and dislikes
    const [likedData, dislikedData, userDefinedData] = await Promise.all([
        fetchStripedArtworkData("likes"),
        fetchStripedArtworkData("dislikes"),
        fetchUserDefinedLists()
    ]);

    const [likesThumbnail, dislikesThumbnail] = await Promise.all([
        getLatestThumbnail({ predefinedList: likedData }, "likes"),
        getLatestThumbnail({ predefinedList: dislikedData }, "dislikes"),
    ]);

    const predefinedListsMetadata: ListMetadata[] = [
        {
            listId: "likes",
            listTitle: "Your Likes",
            listThumb: likesThumbnail,
            totalItems: likedData ? likedData.length : 0,
        },
        {
            listId: "dislikes",
            listTitle: "Your Dislikes",
            listThumb: dislikesThumbnail,
            totalItems: dislikedData ? dislikedData.length : 0,
        },
    ];

    const userDefinedListsMetadata = await Promise.all(
        userDefinedData ? userDefinedData.map(async (list) => {
            const listItems = await getListItemsForUserDefinedLists(list.id);
            const thumbnail = list.custom_thumnail ? list.custom_thumnail : await getLatestThumbnail({ userDefinedList: listItems });

            return {
                listId: list.id,
                listThumb: thumbnail,
                listTitle: list.title,
                totalItems: listItems ? listItems.length : 0,
            };
        }) : []
    ) as ListMetadata[];

    return { predefined: predefinedListsMetadata, userDefined: userDefinedListsMetadata };
}

export async function fetchUserDefinedList(id: bigint): Promise<ListItemWithMetadata | null> {
    const supabase = createServerClient();

    // Fetch metadata for the list
    const { data: metadata, error: metadataError } = await supabase
        .from("lists")
        .select("*")
        .eq("id", id)
        .single() as { data: List | null; error: PostgrestError | null; };

    if (metadataError) {
        console.error(`Failed to fetch metadata for list ID ${id}:`, metadataError);
        return null;
    }

    if (!metadata) {
        console.warn(`No metadata found for list ID ${id}`);
        return null;
    }

    // Fetch list items
    const { data: listItems, error: listItemsError } = await supabase
        .from("list_items")
        .select("*")
        .eq("list_id", id) as { data: ListItem[] | null; error: PostgrestError | null; };

    if (listItemsError) {
        console.error(`Failed to fetch items for list ID ${id}:`, listItemsError);
        return null;
    }

    if (!listItems || listItems.length === 0) {
        console.warn(`No items found for list ID ${id}`);
        return { ...metadata, items: [] };
    }

    // Fetch artwork data in parallel
    const artworkDataMap = new Map<string, ArtworkWithUserName>();
    const artworkPromises = listItems.map(async (item) => {
        if (!artworkDataMap.has(item.artwork_id)) {
            const { data: artworkData, error: artworkError } = await supabase
                .from("artworks")
                .select("*")
                .eq("id", item.artwork_id)
                .single() as {
                    data: ArtWork | null;
                    error: PostgrestError | null;
                };

            if (artworkError) {
                console.error(`Failed to fetch artwork data for artwork ID ${item.artwork_id}:`, artworkError);
            } else if (artworkData) {
                artworkDataMap.set(item.artwork_id, { artist_user_name: await fetchArtistUserName(artworkData.artist_id), ...artworkData });
            }
        }
    });

    await Promise.all(artworkPromises);

    // Construct the list with metadata
    const listWithListItems: ListItemWithMetadata = {
        ...metadata,
        items: listItems.map((item) => {
            const artwork = artworkDataMap.get(item.artwork_id)!;
            return {
                id: item.id,
                artwork: artwork,
            };
        }),
    };

    return listWithListItems;
}
