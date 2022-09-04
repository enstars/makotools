import { WP_REST_API_Post } from "wp-types";

interface MkAnnouncement extends WP_REST_API_Post {}

interface CollectedCard {
  id: ID;
  count: number;
}

interface UserData {
  collection?: CollectedCard[];
  username: string;
  name?: string;
  profile__banner?: number[];
  profile__bio?: string;
  profile__pronouns?: string;
  profile__start_playing?: string;
}

interface LoadedData<DataType> {
  main: DataType;
  mainLang: DataType;
  subLang: DataType;
}
