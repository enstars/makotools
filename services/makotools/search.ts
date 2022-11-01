import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import fuzzysort from "fuzzysort";

interface Filter<Data> {
  type: string;
  values: any;
  function: (v: any) => (d: Data) => boolean;
}
interface Sort<Data> {
  type: string;
  function: (a: Data, b: Data) => number;
}
interface UseFilter {
  [type: string]: any;
}
interface ViewType {
  filters: UseFilter;
  search: string;
  sort: {
    type: string;
    ascending: boolean;
  };
}
interface SearchSettings {
  fields: string[];
}
interface OptionsType<DataType> {
  filters: Filter<DataType>[];
  sorts: Sort<DataType>[];
  baseSort: string;
  search: SearchSettings;
}

// fss = filter + search + sort
export default function useFSSList<DataType>(
  data: DataType[],
  view: ViewType,
  options: OptionsType<DataType>
) {
  const [results, setResults] = useState(data);
  const [debouncedSearch] = useDebouncedValue(view.search, 200);

  useEffect(() => {
    let filteredList = data;

    options.filters.forEach((filter) => {
      filteredList = filteredList.filter(filter.function(view));
    });

    if (debouncedSearch) {
      const searchedList = fuzzysort.go(debouncedSearch, filteredList, {
        keys: options.search.fields,
        all: true,
      });
      const sortedSearchList = [...searchedList]
        .sort((a: any, b: any) => b.score - a.score)
        .map((cr) => cr.obj);
      setResults(sortedSearchList);
    } else {
      const sortDirection = view.sort.ascending ? 1 : -1;

      const baseSortFunction =
        options.sorts.find((s) => s.type === options.baseSort)?.function ||
        ((a: any, b: any) => a.id - b.id);
      let sortedList = filteredList.sort(
        (a, b) => baseSortFunction(a, b) * sortDirection
      );

      const viewSortFunction = options.sorts.find(
        (s) => s.type === view.sort.type
      )?.function;
      if (viewSortFunction) {
        sortedList = sortedList.sort(
          (a, b) => viewSortFunction(a, b) * sortDirection
        );
      }
      setResults(sortedList);
    }
  }, [view, debouncedSearch, data, options]);

  return results;
}
