-- Ensure that the uuid extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creating the artworks table to store the artwork details
CREATE TABLE public.artworks (
    artist_uid UUID NOT NULL,  -- Reference to the user who created the artwork
    artwork_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Auto-generate unique ID for artwork
    artwork_type TEXT NOT NULL CHECK (artwork_type IN ('illustration', 'manga', 'light_novel')),  -- Type of artwork
    title TEXT NOT NULL,  -- Title of the artwork
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Default to empty array if not provided
    description TEXT DEFAULT NULL,  -- Optional description of the artwork (nullable)
    flags TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Default to empty array if not provided
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when artwork was created
    likes TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Default to empty array if not provided
    dislikes TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Default to empty array if not provided
    images TEXT[] NOT NULL,  -- Array of URLs for the artwork's images
    FOREIGN KEY (artist_uid) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Creating the comments table to store the comments on artworks
CREATE TABLE public.comments (
    artwork_id UUID NOT NULL,  -- Reference to the artwork this comment belongs to
    comment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Auto-generate unique ID for comment
    uid UUID NOT NULL,  -- User ID of the commenter
    comment TEXT NOT NULL,  -- The comment text
    flags TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Default to empty array if not provided
    is_edited TIMESTAMP DEFAULT NULL,  -- Timestamp of when the comment was edited (nullable)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of when the comment was posted
    FOREIGN KEY (artwork_id) REFERENCES public.artworks (artwork_id) ON DELETE CASCADE  -- Foreign key to artworks table
);

-- Creating the replies table to store replies to comments
CREATE TABLE public.replies (
    comment_id UUID NOT NULL,  -- Reference to the comment this reply belongs to
    reply_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Auto-generate unique ID for reply
    uid UUID NOT NULL,  -- User ID of the replier
    reply TEXT NOT NULL,  -- The reply text
    flags TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Default to empty array if not provided
    replying_to TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Default to empty array if not provided
    is_edited TIMESTAMP DEFAULT NULL,  -- Timestamp of when the reply was edited (nullable)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of when the reply was posted
    FOREIGN KEY (comment_id) REFERENCES public.comments (comment_id) ON DELETE CASCADE  -- Foreign key to comments table
);
