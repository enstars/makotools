import {
  Center,
  Loader,
  Paper,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Announcement from "./Announcement";

const PER_PAGE = 10; //max 100
const CATEGORIES = [5, 6];

function SiteAnnouncements() {
  const theme = useMantineTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [allPagesCount, setAllPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAsync = async () => {
      const initRespose = await fetch(
        `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts?categories=${CATEGORIES.join(
          ","
        )}&per_page=${PER_PAGE}&page=1`
      );

      const initData = await initRespose.json();
      setAllPagesCount(initRespose.headers.get("X-WP-TotalPages"));
      setAnnouncements(initData);
      setCurrentPage(2);
    };
    fetchAsync();
  }, []);

  const loadMore = async () => {
    const newLoad = await (
      await fetch(
        `https://backend-stars.ensemble.moe/wp-main/wp-json/wp/v2/posts?categories=${CATEGORIES.join(
          ","
        )}&per_page=${PER_PAGE}&page=${currentPage}`
      )
    ).json();
    setAnnouncements((a) => [...a, ...newLoad]);
    setCurrentPage((p) => p + 1);
  };

  console.log(announcements);

  return (
    <>
      <InfiniteScroll
        dataLength={(currentPage - 1) * PER_PAGE} //This is important field to render the next data
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
          <Announcement key={a.id} announcement={a} i={i}></Announcement>
        ))}
      </InfiniteScroll>
    </>
  );
}

export default SiteAnnouncements;
