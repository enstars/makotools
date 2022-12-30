import { Center, Loader, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Announcement from "./Announcement";

import { MakoPost, StrapiItem } from "types/makotools";
import { fetchOceans } from "services/makotools/posts";

const PER_PAGE = 10; //max 100
const CATEGORIES = [5, 6];

function AnnouncementsList() {
  const theme = useMantineTheme();
  const [announcements, setAnnouncements] = useState<MakoPost[]>([]);
  const [allPagesCount, setAllPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAsync = async () => {
      const postResponses = await fetchOceans<StrapiItem<MakoPost>[]>(
        "/posts",
        {
          populate: "*",
          sort: "date_created:desc",
          pagination: { page: 1, pageSize: 25 },
        }
      );
      const totalPages = (postResponses.meta.pagination as any).pageCount;
      if (totalPages) {
        setAllPagesCount(totalPages);
      }
      setAnnouncements(postResponses.data.map((p) => p.attributes));
      setCurrentPage(1);
    };
    fetchAsync();
  }, []);

  const loadMore = async () => {
    const postResponses = await fetchOceans<StrapiItem<MakoPost>[]>("/posts", {
      populate: "*",
      sort: "date_created:desc",
      pagination: { page: currentPage + 1, pageSize: 25 },
    });
    setAnnouncements((a) => [
      ...a,
      ...postResponses.data.map((p) => p.attributes),
    ]);
    setCurrentPage((p) => p + 1);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={(currentPage - 1) * PER_PAGE}
        next={loadMore}
        hasMore={currentPage <= allPagesCount}
        loader={
          <Center sx={{ gridColumn: "s/e" }} my="lg">
            <Loader variant="bars" />
          </Center>
        }
        style={{
          display: "grid",
          gap: theme.spacing.sm,
        }}
      >
        {announcements.map((a, i) => (
          <Announcement key={a.slug} announcement={a} i={i} />
        ))}
      </InfiniteScroll>
    </>
  );
}

export default AnnouncementsList;
