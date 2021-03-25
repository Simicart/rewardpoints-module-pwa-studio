/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    ['@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js']: '@simicart/rewardpoint/src/override/ProductDetail/productFullDetail.js',
    ['@magento/venia-ui/lib/RootComponents/Category/category.js']: '@simicart/rewardpoint/src/override/Category/category.js',
    ['@magento/venia-ui/lib/components/Gallery/gallery.js']: '@simicart/rewardpoint/src/override/Gallery/gallery.js',
    ['@magento/venia-ui/lib/components/AccountMenu/accountMenuItems.js']: '@simicart/rewardpoint/src/override/AccountMenu/accountMenuItem.js',
    ['@magento/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.js']: '@simicart/rewardpoint/src/override/CartPage/PriceAdjustments/priceAdjustments.js',
    [`@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.js`]:'@simicart/rewardpoint/src/override/CartPage/PriceSummary/priceSummary.js',
    ['@magento/venia-ui/lib/components/CheckoutPage/PriceAdjustments/priceAdjustments.js']: '@simicart/rewardpoint/src/override/CheckoutPage/PriceAdjustments/priceAdjustments.js'
};
