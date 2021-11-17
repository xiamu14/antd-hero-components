export type Use = "table" | "description" | "form";

export interface Item {
  key: string;
  name: string;
  use: Use[];
  render?: Function;
  tableProps?: any;
  formProps?: any;
  descriptionProps?: any;
}
export type Items = Record<string, Item>;

export interface Properties {
  properties: [string] | Record<string, Properties>;
}
