declare module "raw-loader!*" {
  const contents: string;
  export = contents;
}

declare module "*.svg?url" {
  const contents: any;
  export = contents;
}

// search.ts

interface Filter<Data, Filters> {
  type: string;
  values: any;
  function: (v: ViewType<Filters>) => (d: Data) => boolean;
}
interface Sort<Data> {
  label: string;
  value: string;
  function: (a: Data, b: Data) => number;
}
interface UseFilter {
  [type: string]: string | any[];
}
interface ViewType<Filters> {
  filters: Filters & UseFilter;
  search: string;
  sort: {
    type: string;
    ascending: boolean;
  };
}
interface SearchSettings {
  fields: string[];
}
interface FSSOptions<DataType, Filters = UseFilter> {
  filters: Filter<DataType, Filters>[];
  sorts: Sort<DataType>[];
  baseSort: string;
  search: SearchSettings;
  defaultView: ViewType<Filters>;
}
