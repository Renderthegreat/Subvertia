import * as Cheerio from 'cheerio';
export type Course = {
    name: string;
    id: string;
    assignments: Assignment[];
};
export type Assignment = {
    name: string;
    id: string;
    description: ReturnType<ReturnType<typeof Cheerio.load>>;
    urls: string[];
    due: Date | null;
    complete: boolean;
} | null;
