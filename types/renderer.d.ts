export interface I18nMap {
  [key: string]: string;
}

export interface MetaEntry {
  title?: string;
  description?: string;
  alias?: string;
  keywords?: string[];
  image?: string;
  type?: string;
  locale?: string;
  url?: string;
  canonical?: string;
  robots?: string[];
  twitter?: string[];
  og?: string[];
}

export interface Meta {
  [key: string]: MetaEntry;
}

export type BlockSlotMap = Record<string, Block[]>;

export interface Block {
  id?: number | string;
  component: string;
  componentProps?: Record<string, unknown>;
  componentSlots?: Block[] | BlockSlotMap | string;
}

export interface Seo {
  title?: string;
  description?: string;
  alias?: string;
}

export interface BlockRenderer {
  seo?: Seo;
  i18n?: I18nMap;
  block?: Block[];
  blocks: Block[];
  meta?: Meta;
  tailwindConfig?: Record<string, unknown>;
}
