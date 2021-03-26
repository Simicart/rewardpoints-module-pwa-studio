import React, {useState} from 'react';
import {gql, useMutation, useQuery} from '@apollo/client';
import { Price } from '@magento/peregrine';
import {usePriceSummary} from "../../../talons/usePriceSummary";
import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.css';
import DiscountSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import GiftCardSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/giftCardSummary';
import ShippingSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/shippingSummary';
import TaxSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/taxSummary';
import { PriceSummaryFragment } from './priceSummaryFragment';
import {useCartContext} from "@magento/peregrine/lib/context/cart";

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;


/**
 * A child component of the CartPage component.
 * This component fetches and renders cart data, such as subtotal, discounts applied,
 * gift cards applied, tax, shipping, and cart total.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [priceSummary.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary";
 */
const PriceSummary = props => {
    const { isUpdating } = props;
    const [{ cartId }] = useCartContext();
    const classes = mergeClasses(defaultClasses, props.classes);
    const talonProps = usePriceSummary({queries: {
            getPriceSummary: GET_PRICE_SUMMARY
        }});
    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        isCheckout,
        isLoading,
        flatData,
    } = talonProps;
    let mpRewardEarn, mpRewardDiscount, mpRewardSpent;

    if (hasError) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    Something went wrong. Please refresh and try again.
                </span>
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const { subtotal, total, discounts, giftCards, taxes, shipping, priceData } = flatData;
    console.log(flatData)
    if(priceData.length >1) {
        mpRewardDiscount = priceData[0];
        mpRewardSpent = priceData[1];
        mpRewardEarn = priceData[2];
    }
    else mpRewardEarn = priceData[0];

    const isPriceUpdating = isUpdating || isLoading;
    const priceClass = isPriceUpdating ? classes.priceUpdating : classes.price;
    const totalPriceClass = isPriceUpdating
        ? classes.priceUpdating
        : classes.totalPrice;

    const proceedToCheckoutButton = !isCheckout ? (
        <div className={classes.checkoutButton_container}>
            <Button
                disabled={isPriceUpdating}
                priority={'high'}
                onClick={handleProceedToCheckout}
            >
                {'Proceed to Checkout'}
            </Button>
        </div>
    ) : null;

    const MpRewardEarnedTitleView = (mpRewardEarn ?
        <span className={classes.lineItemLabel}>{mpRewardEarn.title}</span>
    : null);
    const MpRewardEarnedValueView = (mpRewardEarn ?
            <div className={priceClass}><strong>{mpRewardEarn.value} points</strong></div>
            : null
    );
    const MpRewardSpentTitleView = (mpRewardSpent ?
        <span className={classes.lineItemLabel}>{mpRewardSpent.title}</span>
        : null);
    const MpRewardSpentValueView = (mpRewardSpent ?
            <div className={priceClass}><strong>{mpRewardSpent.value} points</strong></div>
            : null
    );
    const MpRewardDiscountTitleView = (mpRewardDiscount ?
        <span className={classes.lineItemLabel}>{mpRewardDiscount.title}</span>
        : null);
    const MpRewardDiscountValueView = (mpRewardDiscount ?
            <span className={priceClass}>
                    <Price
                        value={mpRewardDiscount.value}
                        currencyCode={subtotal.currency}
                    />
                    </span>            : null
    );
    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                {MpRewardEarnedTitleView}
                {MpRewardEarnedValueView}
                {MpRewardSpentTitleView}
                {MpRewardSpentValueView}
                <span className={classes.lineItemLabel}>{'Subtotal'}</span>
                <span className={priceClass}>
                    <Price
                        value={subtotal.value}
                        currencyCode={subtotal.currency}
                    />
                    </span>
                {MpRewardDiscountTitleView}
                {MpRewardDiscountValueView}
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={discounts}
                />
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={giftCards}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={taxes}
                    isCheckout={isCheckout}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={shipping}
                    isCheckout={isCheckout}
                />
                <span className={classes.totalLabel}>
                    {isCheckout ? 'Total' : 'Estimated Total'}
                </span>
                <span className={totalPriceClass}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>
            {proceedToCheckoutButton}
        </div>
    );
};

export default PriceSummary;
