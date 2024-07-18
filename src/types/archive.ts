export type CategoryData = {
    id: string
    title: string
}

export type DocumentData = {
    id: string
    title: string
    seoKeywords: string
    outlines: string
}

export type ContentSearchFilter = {
    category?: string
    updateDate?: {
        from: Date
        to: Date
    }
}
