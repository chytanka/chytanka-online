export class MangadexHelper {
    static getCover(relationships: any[]): any {
        return relationships?.filter((r: any) => r.type == 'cover_art')[0] ?? null
    }

    static getTitle(attributes: any): any {
        if (!attributes) return
        return attributes?.altTitles?.filter((alt: any) => alt?.uk)[0]?.uk ?? attributes?.title.en ?? attributes?.title[attributes?.originalLanguage]
    }

    static desc(attributes: any) {
        return attributes.description.uk ?? attributes.description.en ??
            attributes.description[attributes.originalLanguage]
    }

    static getScanlationGroup(relationships: any[]): any {
        return relationships?.filter((r: any) => r.type == 'scanlation_group')[0] ?? null
    }

    static filterTags(tags: any, group: string): Array<any> {
        return tags?.filter((r: any) => r.attributes.group == group).map((v: any) => {
            return {
                id: v.id,
                names: v.attributes.name
            }
        }) ?? []
    }

    static genreTags = (tags: any) => this.filterTags(tags, 'genre')
    static themeTags = (tags: any) => this.filterTags(tags, 'theme')
    static contentTags = (tags: any) => this.filterTags(tags, 'content')
    static formatTags = (tags: any) => this.filterTags(tags, 'format')

    static isLongStrip = (tags: any) => this.formatTags(tags).filter(t => t.names.en == "Long Strip")[0] ? true : false


}
