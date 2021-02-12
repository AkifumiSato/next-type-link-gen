# next-type-link-gen
[![npm version](https://badge.fury.io/js/next-type-link-gen.svg
)](https://badge.fury.io/js/next-type-link-gen)

`next-type-link-gen` is a custom hooks generator that makes Next.js internal links type safe.

### Installation
npm
```
$ npm install next-type-link-gen
```

yarn
```
$ yarn add next-type-link-gen
```

### Example
```tsx
import {
  dynamicRoute,
  nextLinksHooksFactory,
  staticRoute,
} from 'next-type-link-gen'

const useNextLinks = nextLinksHooksFactory({
  top: staticRoute('/'),
  name: dynamicRoute<{
    name: string
    a?: string
    b?: number
  }>('/[name]'),
})

const YourLink: React.FC = () => {
  const links = useNextLinks()

  return (
    <div>
      <Link
        // href: /
        href={links.top.toUrl()}
        // if `pathname` in next/router match, true
        current={links.top.isCurrent()}
      >
        Top
      </Link>
      <Link
        // href: /fake_name?a=aaa&b=999
        href={links.name.toUrl({
          name: 'fake_name',
          a: 'aaa',
          b: 999,
        })}
        // if `pathname` in next/router match, true
        current={links.name.isCurrent()}
      >
        User top
      </Link>
    </div>
  )
}
```

## API
### staticRoute
create static route.
If you want, add parameter type generics.
```ts
const rootPage = staticRoute<{
  a?: string
  b?: number
}>('/')
```

### dynamicRoute
create dynamic route.
Next.js routing parameter & get parameter type define.
Pass the equivalent of Next.js router.pathname as an argument.
```ts
const userPage = dynamicRoute<{
  a?: string
  b?: number
}>('/[name]')
```

### nextLinksHooksFactory
`nextLinksHooksFactory` is custom hooks factory function.
Pass an object with `ReturnType<typeof staticRoute>` or `ReturnType<typeof dynamicRoute>` as value as an argument.
```ts
const useNextLinks = nextLinksHooksFactory({
  top: staticRoute('/'),
  name: dynamicRoute<{
    name: string
    a?: string
    b?: number
  }>('/[name]'),
})

// usage
const links = useNextLinks()
console.log(links.top.toUrl())
```

### UrlScheme
this hooks contain your routing type.
if you want your links, `[route].toUrl` call.
`toUrl`: parameters must be passed as arguments.
`isCurrent`: returns true if it matches the route in Next.js router.pathname.
`toRouteString`: returns route match string.
```ts
console.log(links.top.toUrl())
console.log(links.top.isCurrent())
console.log(links.top.toRouteString())
```

### Test
You can get the information of the page directory of Next.js by `readNextPagesRoute`, and you can also get with linksMapToRouteString the route information you registered, which you can use to test the biosynthesis of links.

```ts
import { renderHook } from '@testing-library/react-hooks'
import { linksMapToRouteString, readNextPagesRoute } from 'next-type-link-gen'
import { useNextLinks } from './url'

test('[useNextLinks] routes', () => {
  const { result } = renderHook(useNextLinks)

  const pageUrls = readNextPagesRoute()
  const routeUrls = linksMapToRouteString(result.current)

  expect(pageUrls).toEqual(expect.arrayContaining(routeUrls))
})
```
