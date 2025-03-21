import { User } from "@/types";

export function isValidArtType(value: string): value is ArtType {
    return ["illustration", "manga", "light_novel"].includes(value);
}

export const ART_TYPE = ["illustration", "manga", "light_novel"] as const;
export type ArtType = (typeof ART_TYPE)[number];

export const ART_TYPE_LABELS: Record<ArtType, string> = {
    illustration: "Illustration",
    manga: "Manga",
    light_novel: "Light Novel",
};

export type Flag = "sfw" | "nsfw" | "spoiler" | "violation_warning" | "banned";

export type UUID = string;
export type ISO_8601 = string;

export type PredefinedList = {
    uid: UUID;
    timestamp: ISO_8601;
};

/** For better Readibility */
type PrimaryKey<T> = T;
type ForeignKey<T> = T;
type Constraint<T> = T;
type DefaultValue<T> = T;
type NULLABLE<T> = T | null;

/**
 * Type defining structure for an artwork.
 */
export interface ArtWork {
    /**
     * This is to identify which user this artwork belongs to.
     */
    artist_id: ForeignKey<User["id"]>;

    /**
     * Unique ID of the artwork.
     */
    id: PrimaryKey<UUID>;

    /**
     * Type of the artwork.
     * Can be either of these three: `illustration` | `manga` | `light_novel`
     */
    artwork_type: Constraint<ArtType>;

    /**
     * Title of the artwork.
     */
    title: string;

    /**
     * Tags for categorization.
     */
    tags: NULLABLE<string[]>;

    /**
     * Optional description of the artwork.
     */
    description: NULLABLE<string>;

    /**
     * Flags to identify the type of artwork in internal algorithms.
     */
    flags: NULLABLE<Constraint<Flag>[]>;


    /** Indicates when the ArtWork was edited. Null if never edited. */
    updated_at: NULLABLE<ISO_8601>;

    /** Timestamp of when the artwork was created. */
    created_at: DefaultValue<ISO_8601>;

    /** An array of user IDs who liked the artwork. */
    likes: NULLABLE<PredefinedList[]>;

    /** An array of user IDs who disliked the artwork. */
    dislikes: NULLABLE<PredefinedList[]>;

    /** An array of URLs for the artwork's images. */
    images: {
        bucket: string,
        path: string
    }[];
};


/**
 * Interface defining the structure of a comment.
 */
export interface Comment {
    /**
     * This is to identify which artwork this comment belongs to.
     */
    artwork_id: ForeignKey<ArtWork["id"]>;

    /** Unique ID of the comment. */
    id: PrimaryKey<bigint>;

    /** User ID of the commenter. */
    uid: ForeignKey<User["id"]>;

    /** The comment text. */
    comment: string;

    /** Flags to identify the type of comment in internal algorithms. */
    flags: NULLABLE<Constraint<Flag>[]>;

    /** Indicates when the comment was edited. Null if never edited. */
    updated_at: NULLABLE<ISO_8601>;

    /** Timestamp when the comment was posted. */
    created_at: DefaultValue<ISO_8601>;
}


/**
 * Interface defining the structure of a reply to a comment.
 */
export interface Reply {
    /** This is to identify which comment this reply belongs to. */
    comment_id: ForeignKey<Comment["id"]>;

    /** Unique ID of the reply. */
    id: PrimaryKey<bigint>;

    /** User ID of the replier. */
    uid: ForeignKey<User["id"]>;

    /** The reply text. */
    reply: string;

    /** Flags to identify the type of reply in internal algorithms. */
    flags: NULLABLE<Constraint<Flag>[]>;

    /** User ID of the user being replied to. */
    replying_to: ForeignKey<User["id"]>;

    /** Indicates when the reply was edited. Null if never edited. */
    updated_at: NULLABLE<ISO_8601>;

    /** Timestamp when the reply was posted. */
    created_at: DefaultValue<ISO_8601>;
}


/**
 * Interface defining the structure of a reply to a comment.
 */
export interface List {
    /** This is to identify who this List belongs to. */
    belongs_to: ForeignKey<User["id"]>;

    /** Unique ID of the List. */
    id: PrimaryKey<string>;

    /** Title of the List */
    title: string;

    /** User defined thumbnail URL for the list.  */
    custom_thumnail: NULLABLE<string>;

    /** Timestamp when the list was last updated. */
    updated_at: NULLABLE<ISO_8601>;

    /** Timestamp when the list was created. */
    created_at: DefaultValue<ISO_8601>;
}


/**
 * Interface defining the structure of a reply to a comment.
 */
export interface ListItem {
    /** This is to identify which List this ListItem belongs to. */
    list_id: ForeignKey<List["id"]>;

    /** This is to identify which artwork is being hold by the item */
    artwork_id: ForeignKey<ArtWork["id"]>;

    /** Unique ID of the List. */
    id: PrimaryKey<bigint>;

    /** Timestamp when the item was added to the List. */
    added_at: DefaultValue<ISO_8601>;
}

