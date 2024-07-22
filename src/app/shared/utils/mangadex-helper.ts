export class MangadexHelper {
    static getCover(relationships: any[]): any {
        return relationships?.filter((r: any) => r.type == 'cover_art')[0] ?? null
    }

    static getTitle(attributes: any): any {
        if (!attributes) return
        return attributes?.altTitles?.filter((alt: any) => alt?.uk)[0]?.uk ?? attributes?.title.en ?? attributes?.title[attributes?.originalLanguage]
    }

    static getScanlationGroup(relationships: any[]): any {
        return relationships?.filter((r: any) => r.type == 'scanlation_group')[0] ?? null
    }
}
