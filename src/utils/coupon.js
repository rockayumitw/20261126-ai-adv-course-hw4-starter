const COUPONS = Object.freeze({
  FLOWER100: Object.freeze({
    minSubtotal: 800,
    calculate: () => 100
  }),
  SPRING10: Object.freeze({
    minSubtotal: 0,
    calculate: subtotal => Math.min(Math.round(subtotal * 0.1), 300)
  }),
  SUMMER50: Object.freeze({
    expired: true,
    minSubtotal: 0,
    calculate: () => 50
  })
});

class CouponError extends TypeError {}

/**
 * Validate a coupon code against the item subtotal and compute the discount.
 * Codes are case-insensitive; the returned code is always upper case.
 * The discount only applies to the subtotal (never shipping) and never
 * exceeds it. Throws CouponError for unknown, expired or ineligible codes.
 */
function applyCoupon({ subtotal, couponCode }) {
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    throw new TypeError('subtotal 必須為非負有限數');
  }

  if (couponCode === undefined || couponCode === null || couponCode === '') {
    return Object.freeze({ couponCode: null, discount: 0, discountedSubtotal: subtotal });
  }

  if (typeof couponCode !== 'string') {
    throw new CouponError('優惠碼格式不正確');
  }

  const code = couponCode.trim().toUpperCase();
  const coupon = Object.prototype.hasOwnProperty.call(COUPONS, code) ? COUPONS[code] : null;

  if (!coupon) {
    throw new CouponError('優惠碼無效');
  }
  if (coupon.expired) {
    throw new CouponError('優惠碼已失效');
  }
  if (subtotal < coupon.minSubtotal) {
    throw new CouponError(`商品小計需滿 ${coupon.minSubtotal} 元才能使用此優惠碼`);
  }

  const discount = Math.min(coupon.calculate(subtotal), subtotal);
  return Object.freeze({ couponCode: code, discount, discountedSubtotal: subtotal - discount });
}

module.exports = { COUPONS, CouponError, applyCoupon };
