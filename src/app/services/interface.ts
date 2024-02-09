export type VideoGenre = "documentation" | "blockbuster" | "comedy" | "action" | "drama" | "sitcom";


export interface Video {
    title: string;
    actors: string;
    created_at: string;
    description: string;
    genre: VideoGenre;
    id: number;
    thumbnail: string;
    video_file: string;
}


export interface User {
    
}