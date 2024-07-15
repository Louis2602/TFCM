export type Column = {
    index: string;
    columnName: string;
}

export type Card = {
    id: string;
    column: string;
    content: string;
    flairs: string[];
}
