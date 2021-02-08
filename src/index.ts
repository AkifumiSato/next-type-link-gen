type Params = {
  [key: string]: string | number | undefined
}

export const queryFactory = (params: Params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${ key }=${ value }`)
    .join('&')

  if (query.length === 0) {
    return ''
  }
  return `?${ query }`
}

export abstract class UrlScheme<T extends Params> {
  protected constructor(
    protected url: string,
    protected currentRoutePath: string
  ) {
  }

  isCurrent(): boolean {
    return this.url === this.currentRoutePath
  }

  abstract toUrl(arg: T): string
}

export class StaticUrl<T extends Params> extends UrlScheme<T> {
  constructor(url: string, currentRoutePath: string) {
    super(url, currentRoutePath)
  }

  toUrl(arg?: T) {
    if (arg) {
      return this.url + queryFactory(arg)
    }
    return this.url
  }
}

export class DynamicUrl<T extends Params> extends UrlScheme<T> {
  constructor(url: string, currentRoutePath: string) {
    super(url, currentRoutePath)
  }

  toUrl(arg: T): string {
    const regex = /\[.\w*\]/g
    const foundParams = this.url.match(regex) ?? []

    let urlString = this.url

    for (const param of foundParams) {
      const key = param.replace('[', '').replace(']', '')
      const value = arg[key] as string | number
      urlString = urlString.replace(param, value.toString())
    }

    const urlParamsKey = foundParams
      .map(key => key.replace('[', '').replace(']', ''))
    const queryParams = Object.entries(arg)
      .filter(([key]) => !urlParamsKey.includes(key))
      .reduce<{
        [key: string]: string | number | undefined
      }>((accum, [key, value]) => {
        accum[key] = value
        return accum
      }, {})

    if (queryParams.length === 0) {
      return urlString
    }

    return urlString + queryFactory(queryParams)
  }
}

export const staticRoute = <T extends Params>(url: string) => (currentPath: string) => new StaticUrl<T>(url, currentPath)
export const dynamicRoute = <T extends Params>(url: string) => (currentPath: string) => new DynamicUrl<T>(url, currentPath)
// todo add nextLinkFactory
// todo add useNextLink
// todo cli template add
// todo add index.d.ts
