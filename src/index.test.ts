import { DynamicUrl, queryFactory, staticRoute, StaticUrl } from '.'

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
