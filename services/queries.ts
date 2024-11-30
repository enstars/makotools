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

export const reactionQueries = {
  fetchReactions: (pid: string | undefined) => ["fetchReactions", pid],
};
