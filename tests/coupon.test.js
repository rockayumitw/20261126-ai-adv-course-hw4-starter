const { CouponError, applyCoupon } = require('../src/utils/coupon');

describe('Coupon module', () => {
  it('未使用優惠碼時折扣為 0', () => {
    expect(applyCoupon({ subtotal: 500 })).toMatchObject({ couponCode: null, discount: 0, discountedSubtotal: 500 });
    expect(applyCoupon({ subtotal: 500, couponCode: '' }).discount).toBe(0);
  });

  it('FLOWER100 滿 800 折 100，799 不可用', () => {
    expect(applyCoupon({ subtotal: 800, couponCode: 'FLOWER100' })).toMatchObject({
      couponCode: 'FLOWER100', discount: 100, discountedSubtotal: 700
    });
    expect(() => applyCoupon({ subtotal: 799, couponCode: 'FLOWER100' })).toThrow(CouponError);
  });

  it.each([
    [1000, 100],
    [1234, 123],
    [1235, 124],
    [3500, 300]
  ])('SPRING10 小計 %i 折 %i（上限 300、四捨五入）', (subtotal, discount) => {
    expect(applyCoupon({ subtotal, couponCode: 'SPRING10' }).discount).toBe(discount);
  });

  it('優惠碼不分大小寫，並以大寫記錄', () => {
    expect(applyCoupon({ subtotal: 800, couponCode: ' flower100 ' }).couponCode).toBe('FLOWER100');
  });

  it.each(['SUMMER50', 'NOPE', 'constructor', '__proto__', 123])('無效或失效的優惠碼 %j 會丟出 CouponError', (couponCode) => {
    expect(() => applyCoupon({ subtotal: 1000, couponCode })).toThrow(CouponError);
  });

  it('折扣不會超過小計', () => {
    expect(applyCoupon({ subtotal: 800, couponCode: 'FLOWER100' }).discountedSubtotal).toBeGreaterThanOrEqual(0);
  });
});
