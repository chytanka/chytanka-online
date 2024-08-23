export class MangadexHelper {
    static isNSFW(attributes: any) {
        return (['pornographic', 'erotica'].includes(attributes.contentRating))
    }
    static getCover(relationships: any[]): any {
        return relationships?.filter((r: any) => r.type == 'cover_art')[0] ?? null
    }

    static getAuthor(relationships: any[]): any {
        return relationships?.filter((r: any) => r.type == 'author')[0] ?? null
    }

    static getArtist(relationships: any[]): any {
        return relationships?.filter((r: any) => r.type == 'artist')[0] ?? null
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
        return relationships?.filter((r: any) => r.type == 'scanlation_group') ?? []
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


    protected static siteTemplates = new Map<string, { name: string, template: string }>()
        .set("al", { name: 'anilist', template: `https://anilist.co/manga/{{value}}` })
        .set("ap", { name: 'animeplanet', template: `https://www.anime-planet.com/manga/{{value}}` })
        .set("bw", { name: 'bookwalker.jp', template: `https://bookwalker.jp/{{value}}` })
        .set("mu", { name: 'mangaupdates', template: `https://www.mangaupdates.com/series.html?id={{value}}` })
        .set("nu", { name: 'novelupdates', template: `https://www.novelupdates.com/series/{{value}}` })
        .set("kt", { name: 'kitsu.io', template: `https://kitsu.io/api/edge/manga/{{value}}` })
        .set("amz", { name: 'amazon', template: `{{value}}` })
        .set("ebj", { name: 'ebookjapan', template: `{{value}}` })
        .set("mal", { name: 'myanimelist', template: `https://myanimelist.net/manga/{{value}}` })
        .set("cdj", { name: 'CDJapan', template: `{{value}}` })
        .set("raw", { name: 'RAW', template: `{{value}}` })
        .set("engtl", { name: 'English', template: `{{value}}` })


    static getLink(id: string, value: string) {
        const res = this.siteTemplates.get(id);
        if (!res) return null

        return {
            name: res.name,
            template: res.template.replace('{{value}}', value)
        }
    }

    static getAlias(attributes: any): any {
        if (!attributes) return

        let alias: string = attributes?.title.en ?? '';
        alias = alias.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        return alias;
    }

    static statusMap = new Map<string, string>().set('ongoing', '📝').set('completed', '✅')
    static contentRatingMap = new Map<string, string>().set('safe', '🎈')
        .set('suggestive', '😏')
        .set('erotica', '👙')
        .set('pornographic', '🔞')

}
