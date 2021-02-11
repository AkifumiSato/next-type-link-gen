import { renderHook } from '@testing-library/react-hooks'
import * as nextRouter from 'next/router';
import {
  dynamicRoute,
  DynamicUrl,
  nextLinksHooksFactory,
  queryFactory,
  staticRoute,
  StaticUrl
} from '.'

describe('[queryFactory]', () => {
  test('some', () => {
    expect(queryFactory({
      a: 1,
      b: 'hoge',
    })).toBe('?a=1&b=hoge')
  })

  test('none', () => {
    expect(queryFactory({})).toBe('')
  })
})

describe('[StaticUrl]', () => {
  test('toUrl', () => {
    expect(new StaticUrl('/dummy', '/').toUrl()).toBe('/dummy')
  })

  test('toUrl', () => {
    expect(new StaticUrl('/dummy', '/').toUrl({ a: 'aaa', b: 999 })).toBe('/dummy?a=aaa&b=999')
  })

  test('isCurrent: true', () => {
    expect(new StaticUrl('/dummy', '/dummy').isCurrent()).toBe(true)
  })

  test('isCurrent: false', () => {
    expect(new StaticUrl('/dummy', '/').isCurrent()).toBe(false)
  })

  test('currentPath is undefined', () => {
    expect(new StaticUrl('/dummy').isCurrent()).toBe(false)
  })
})

describe('[DynamicUrl]', () => {
  test('isCurrent', () => {
    expect(new DynamicUrl('/[name]', '/[name]').isCurrent()).toBe(true)
  })

  test('isCurrent', () => {
    expect(new DynamicUrl('/[name]', '/').isCurrent()).toBe(false)
  })

  test('currentPath is undefined', () => {
    expect(new DynamicUrl('/[name]').isCurrent()).toBe(false)
  })

  test('toUrl', () => {
    expect(
      new DynamicUrl<{ name: string }>('/[name]', '/').toUrl({ name: 'fake_name' })
    ).toBe('/fake_name')
  })

  test('toUrl', () => {
    expect(
      new DynamicUrl<{
        name: string
        a?: string
        b?: number
      }>('/[name]', '/').toUrl({
        name: 'fake_name',
        a: 'aaa',
        b: 999,
      })
    ).toBe('/fake_name?a=aaa&b=999')
  })
})

describe('[staticRoute]', () => {
  test('isCurrent', () => {
    expect(staticRoute('/dummy')('/').isCurrent()).toBe(false)
    expect(staticRoute('/dummy')('/dummy').isCurrent()).toBe(true)
    expect(staticRoute('/dummy')().isCurrent()).toBe(false)
  })

  test('toUrl', () => {
    expect(staticRoute('/dummy')('/').toUrl()).toBe('/dummy')
  })
})

describe('[dynamicRoute]', () => {
  test('isCurrent', () => {
    expect(dynamicRoute('/[name]')('/').isCurrent()).toBe(false)
    expect(dynamicRoute('/[name]')('/[name]').isCurrent()).toBe(true)
    expect(dynamicRoute('/[name]')().isCurrent()).toBe(false)
  })

  test('toUrl', () => {
    expect(dynamicRoute('/[name]')('/').toUrl({ name: 'fake_name' })).toBe('/fake_name')
  })

  test('toUrl', () => {
    expect(dynamicRoute('/[name]')('/').toUrl({ name: 'fake_name' })).toBe('/fake_name')
  })

  test('toUrl', () => {
    expect(
      dynamicRoute<{
        name: string
        a?: string
        b?: number
      }>('/[name]')('/').toUrl({
        name: 'fake_name',
        a: 'aaa',
        b: 999,
      })
    ).toBe('/fake_name?a=aaa&b=999')
  })
})

describe('[nextLinksHooksFactory]', () => {
  beforeAll(() => {
    // @ts-ignore
    nextRouter.useRouter = jest.fn().mockReset()
  })

  test('normal', () => {
    // @ts-ignore
    (nextRouter.useRouter as jest.Mock).mockImplementation(() => ({ pathname: '/' }))
    const useNextLink = nextLinksHooksFactory({
      top: staticRoute('/'),
      name: dynamicRoute<{
        name: string
        a?: string
        b?: number
      }>('/[name]'),
    })
    const { result } = renderHook(useNextLink)

    expect(result.current.top.isCurrent()).toBe(true)
    expect(result.current.name.toUrl({
      name: 'fake_name',
      a: 'aaa',
      b: 999,
    })).toBe('/fake_name?a=aaa&b=999')
  })

  test('normal', () => {
    // @ts-ignore
    (nextRouter.useRouter as jest.Mock).mockImplementation(() => ({}))
    const useNextLink = nextLinksHooksFactory({
      top: staticRoute('/'),
      name: dynamicRoute<{
        name: string
      }>('/[name]'),
    })
    const { result } = renderHook(useNextLink)

    expect(result.current.top.isCurrent()).toBe(false)
    expect(result.current.name.isCurrent()).toBe(false)
  })
})

