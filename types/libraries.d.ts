declare module "raw-loader!*" {
  const contents: string;
  export = contents;
}

declare module "*.svg?url" {
  const contents: any;
  export = contents;
}
