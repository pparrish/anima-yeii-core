import CharacteristicsSelector from './CharacteristicSelector'
/* eslint-env jest */

describe('Charcteristic selector', () => {
  let selector
  let colection
  let shop
  let setfn
  let settedfn
  let buyfn
  let buyedfn
  let refoundfn
  let refoundedfn
  beforeEach(() => {
    colection = {
      set: jest.fn(),
      get: jest.fn(),
    }
    shop = {
      buyList: {},
      buy: jest.fn(),
      refound: jest.fn(),
      isInStock: jest.fn(),
    }
    selector = new CharacteristicsSelector(
      colection,
      shop
    )
    setfn = jest.fn()
    selector.rules.add(
      '1',
      'characteristics/set',
      setfn
    )
    buyfn = jest.fn()
    selector.rules.add(
      '2',
      'pointsShop/buy',
      buyfn
    )
    settedfn = jest.fn()
    selector.rules.add(
      '3',
      'characteristics/setted',
      settedfn
    )
    buyedfn = jest.fn()
    selector.rules.add(
      '4',
      'pointsShop/buyed',
      buyedfn
    )
    refoundfn = jest.fn()
    selector.rules.add(
      '5',
      'pointsShop/refound',
      refoundfn
    )
    refoundedfn = jest.fn()
    selector.rules.add(
      '6',
      'pointsShop/refounded',
      refoundedfn
    )
  })
  describe('select', () => {
    beforeEach(() => {
      selector.select('test', 5)
    })
    test('colection#set to be called ', () => {
      expect(
        colection.set.mock.calls.length
      ).toBe(1)
    })
    test('shop#buy to be called', () => {
      expect(shop.buy.mock.calls.length).toBe(1)
    })
    test('set, buy, setted, buyed must be called', () => {
      expect(setfn.mock.calls.length).toBe(1)
      expect(buyfn.mock.calls.length).toBe(1)
      expect(settedfn.mock.calls.length).toBe(1)
      expect(buyedfn.mock.calls.length).toBe(1)
    })
  })
  describe('discard', () => {
    beforeEach(() => {
      selector.discard('foo')
    })
    test('colection#set to be called with 0 ', () => {
      expect(
        colection.set.mock.calls.length
      ).toBe(1)
    })
    test('shop#refound to be called', () => {
      expect(shop.refound.mock.calls.length).toBe(
        1
      )
    })
    test('set, refound, setted, refounded must be called', () => {
      shop.buyList.foo = 10
      expect(setfn.mock.calls.length).toBe(1)
      expect(refoundfn.mock.calls.length).toBe(1)
      expect(settedfn.mock.calls.length).toBe(1)
      expect(refoundedfn.mock.calls.length).toBe(
        1
      )
    })
  })
})
