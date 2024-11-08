export const userQueries = {
  fetchProfileData: (uid: string | undefined) => ["fetchProfileData", uid],
  fetchUserData: (id: string | undefined) => ["fetchUserData", id],
  fetchUserDB: (id: string | undefined) => ["fetchUserDB", id],
  fetchPrivateUserDB: (id: string | undefined) => ["fetchPrivateUserDB", id],
};

export const friendQueries = {
  fetchFriendData: (uid: string | undefined) => ["fetchFriendData", uid],
};

export const cardCollectionQueries = {
  fetchCardCollections: (uid: string | undefined) => [
    "fetchCardCollections",
    uid,
  ],
  fetchCardCollection: ["fetchCardCollection"],
};

export const dataQueries = {
  fetchCharacterData: (cid: number | undefined) => ["fetchCharacterData", cid],
  fetchCardData: (cid: string | undefined) => ["fetchCardData", cid],
  fetchCardObtainMethod: (cid: number | undefined) => [
    "fetchCardObtainMethod",
    cid,
  ],
};
