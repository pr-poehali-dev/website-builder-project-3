export type SiteSection = { tag: string; description: string };

export type Site = {
  id: string;
  name: string;
  tagline: string;
  palette: string;
  sections: SiteSection[];
  createdAt: number;
  updatedAt: number;
  published: boolean;
  domain?: string;
};

const STORAGE_KEY = 'konstrai_sites';

export const createSiteId = (): string => crypto.randomUUID();

export const getSites = (): Site[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed as Site[];
};

export const getSite = (id: string): Site | undefined => {
  return getSites().find((s) => s.id === id);
};

export const saveSite = (site: Site): void => {
  const sites = getSites();
  const index = sites.findIndex((s) => s.id === site.id);
  if (index >= 0) {
    sites[index] = site;
  } else {
    sites.push(site);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
};

export const deleteSite = (id: string): void => {
  const sites = getSites().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
};
