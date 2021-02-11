# next-type-link-gen
`next-type-link-gen` is a custom hooks generator that makes next internal links type safe.

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
Next routing parameter & get parameter type define.
Pass the equivalent of Next router.pathname as an argument.
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
```

### Test
todo
