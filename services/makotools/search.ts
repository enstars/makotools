import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import fuzzysort from "fuzzysort";

// fss = filter + search + sort
export default function useFSSList<DataType>(
  data: DataType[],
  view: ViewType,
  options: FSSOptions<DataType>
) {
  const [results, setResults] = useState(data);
  const [debouncedSearch] = useDebouncedValue(view.search, 200);

  useEffect(() => {
    let filteredList = data;

    console.log("s", JSON.stringify(data.map((e) => e.event_id)));
    console.log("s", JSON.stringify(filteredList.map((e) => e.event_id)));

    let finalList;
    options.filters.forEach((filter) => {
      if (view.filters[filter.type].length) {
        filteredList = filteredList.filter(filter.function(view));
      }
      JSON.stringify(filteredList.map((e) => e.event_id));
    });

    if (debouncedSearch) {
      const searchedList = fuzzysort.go(debouncedSearch, filteredList, {
        keys: options.search.fields,
        all: true,
      });
      const sortedSearchList = [...searchedList]
        .sort((a: any, b: any) => b.score - a.score)
        .map((cr) => cr.obj);
      finalList = sortedSearchList;
      //   setResults(sortedSearchList);
    } else {
      const sortDirection = view.sort.ascending ? 1 : -1;
      console.log(
        view.sort.ascending,
        sortDirection,
        JSON.stringify(filteredList.map((e) => e.event_id)),
        filteredList[0]?.event_id
      );

      const baseSortFunction =
        options.sorts.find((s) => s.value === options.baseSort)?.function ||
        ((a: any, b: any) => a.id - b.id);
      let sortedList = filteredList.sort(
        (a, b) => baseSortFunction(a, b) * sortDirection
      );

      const viewSortFunction = options.sorts.find(
        (s) => s.value === view.sort.type
      )?.function;
      if (viewSortFunction) {
        sortedList.sort((a, b) => viewSortFunction(a, b) * sortDirection);
      }
      console.log(
        "postsort",
        JSON.stringify(sortedList.map((e) => e.event_id))
      );
      finalList = sortedList;
      //   setResults(sortedList);
    }
    setResults(finalList);
  }, [view, debouncedSearch, data, options]);

  return results;
}
