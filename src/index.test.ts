import { dynamicRoute, DynamicUrl, nextLinkHooksFactory, queryFactory, staticRoute, StaticUrl } from '.'

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
})

describe('[DynamicUrl]', () => {
  test('isCurrent', () => {
    expect(new DynamicUrl('/[name]', '/[name]').isCurrent()).toBe(true)
  })

  test('isCurrent', () => {
    expect(new DynamicUrl('/[name]', '/').isCurrent()).toBe(false)
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
  })

  test('toUrl', () => {
    expect(staticRoute('/dummy')('/').toUrl()).toBe('/dummy')
  })
})

describe('[dynamicRoute]', () => {
  test('isCurrent', () => {
    expect(dynamicRoute('/[name]')('/').isCurrent()).toBe(false)
    expect(dynamicRoute('/[name]')('/[name]').isCurrent()).toBe(true)
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

describe('[nextLinkHooksFactory]', () => {
  test('normal', () => {
    const useNextLink = nextLinkHooksFactory({
      top: staticRoute('/'),
      name: dynamicRoute<{
        name: string
        a?: string
        b?: number
      }>('/[name]'),
    })
    const links = useNextLink('/')

    expect(links.top.isCurrent()).toBe(true)
    expect(links.name.toUrl({
      name: 'fake_name',
      a: 'aaa',
      b: 999,
    })).toBe('/fake_name?a=aaa&b=999')
  })
})

