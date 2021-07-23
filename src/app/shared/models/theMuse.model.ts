export interface Location {
  name: string;
}

export interface Industries {
  name: string;
}

interface Size {
  name: string;
  short_name: string;
}

interface Category {
  name: string;
}

interface Level {
  name: string;
  short_name: string;
}

export interface Company {
  description: string;
  locations: Array<Location>;
  industries: Array<Industries>;
  tags: Array<string>;
  short_name: string;
  name: string;
  publication_date: string;
  model_type: string;
  twitter: string;
  id: number;
  size: Size;
  refs: {
    landing_page: string;
    jobs_page: string;
    mini_f1_image: string;
    f2_image: string;
    logo_image: string;
    f1_image: string;
    f3_image: string;
  };
}

export interface Job {
  contents: string;
  name: string;
  type: string;
  publication_date: string;
  short_name: string;
  model_type: string;
  id: number;
  locations: Array<Location>;
  categories: Array<Category>;
  levels: Array<Level>;
  tags: Array<string>;
  refs: {
    landing_page: string;
  };
  company: {
    id: number;
    short_name: string;
    name: string;
  };
}

export interface JobsResults {
  page?: number;
  page_count?: number;
  items_per_page?: number;
  took?: number;
  timed_out?: boolean;
  total?: number;
  results?: Array<Job>;
  aggregations?: Array<any>;
  code?: number;
  error?: string;
}
