import { WP_REST_API_Post } from "wp-types";

interface MkAnnouncement extends WP_REST_API_Post {}

interface Card {

}

interface CardCollection {
    id: string,
    count: number
}

interface UserData {
    collection: CardCollection[],
    username: string,
    name: string,
    profile__banner: string[],
    profile__bio: string,
    profile__pronouns: string,
    profile__start_playing: string
}