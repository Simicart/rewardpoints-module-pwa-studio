import React, {useState} from 'react';
import { func } from 'prop-types';
import Dropdown from 'react-dropdown';
import Select from 'react-select'

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import GiftOptions from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions';
import ShippingMethods from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods';

import defaultClasses from './priceAdjustments.css';
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_PRICE_SUMMARY, GET_RULE_APPLY, SPEND_REWARD_POINT} from "../PriceSummary/rewardpoint.gql";
import {GET_CUSTOMER_REWARD_POINTS} from "../../../components/RewardPoint/customerRewardPoints.gql";
import Button from "@magento/venia-ui/lib/components/Button";


/**
 * PriceAdjustments is a child component of the CartPage component.
 * It renders the price adjustments forms for applying gift cards, coupons, and the shipping method.
 * All of which can adjust the cart total.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating A callback function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [priceAdjustments.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceAdjustments from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments'
 */
const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { setIsCartUpdating } = props;

    const [{ cartId }] = useCartContext();
    const [loadingPriceData, { error, loading, data }] = useLazyQuery(GET_PRICE_SUMMARY, {fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    })
    const [rewardPoint, setRewardPoint] = useState(0)
    const [spendRewardPoint, {data: spendRewardPointData}] = useMutation(SPEND_REWARD_POINT, {onCompleted(){
            loadingPriceData();
        }});
    const {
        data: rewardPointCustomerData
    } = useQuery(GET_CUSTOMER_REWARD_POINTS, {fetchPolicy:'no-cache'});

    const  applyRuleData  = useQuery(GET_RULE_APPLY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    });
    let minPoint, maxPoint, stepPoint;
    const [selectedValue, setSelectedValue] = useState('rate');
    const handleChange = e => {
        setSelectedValue(e.value);
        if(e.value == 'no_apply'){
            spendRewardPoint({variables: {
                    cart_id: cartId,
                    points: 0,
                    rule_id: 'no_apply',
                    address_information: {}
                }})
        }
        if(e.value == '2'){
            spendRewardPoint({variables: {
                    cart_id: cartId,
                    points: 0,
                    rule_id: '2',
                    address_information: {}
                }})
        }
    }
    if(!applyRuleData || !rewardPointCustomerData || ! applyRuleData.data){
        return ''
    }
    const labelRule = [];
    const balance = rewardPointCustomerData.customer.mp_reward.point_balance;
    const rewardPointData = applyRuleData.data.MpRewardShoppingCartSpendingRules;
    const rules = rewardPointData.rules;
    function getRule(rule){
        if(rule.id == rewardPointData.ruleApplied){
            minPoint = rule.min;
            maxPoint = rule.max;
            stepPoint = rule.step;
        }
        const ruleLabel = rule.label;
        const ruleId = rule.id
        labelRule.push({value: ruleId, label: ruleLabel})
        return {minPoint, maxPoint, stepPoint}
    }
    const rewardPointOption = rules.map(getRule);
    const RewardPointMethod =
        <Select options={labelRule}
                value={labelRule.find(obj => obj.value === selectedValue)}
                onChange={handleChange}
        />;
    console.log(rewardPointData)
    if(selectedValue == 'no_apply'){
        return (
            <div className={classes.root}>
                <Accordion canOpenMultiple={true}>
                    <Section
                        id={'shipping_method'}
                        title={'Estimate your Shipping'}
                    >
                        <ShippingMethods setIsCartUpdating={setIsCartUpdating} />
                    </Section>
                    <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                        <CouponCode setIsCartUpdating={setIsCartUpdating} />
                    </Section>
                    <GiftCardSection setIsCartUpdating={setIsCartUpdating} />
                    <Section id={'gift_options'} title={'See Gift Options'}>
                        <GiftOptions />
                    </Section>
                    <Section id={'reward_points'} title={'Spend Your Points'}>
                        {RewardPointMethod}

                    </Section>
                </Accordion>
            </div>
        );
    }
    if(selectedValue == 'rate'){
        return (
            <div className={classes.root}>
                <Accordion canOpenMultiple={true}>
                    <Section
                        id={'shipping_method'}
                        title={'Estimate your Shipping'}
                    >
                        <ShippingMethods setIsCartUpdating={setIsCartUpdating} />
                    </Section>
                    <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                        <CouponCode setIsCartUpdating={setIsCartUpdating} />
                    </Section>
                    <GiftCardSection setIsCartUpdating={setIsCartUpdating} />
                    <Section id={'gift_options'} title={'See Gift Options'}>
                        <GiftOptions />
                    </Section>
                    <Section id={'reward_points'} title={'Spend Your Points'}>
                        {RewardPointMethod}
                        <div style={{marginBottom: '1rem', marginTop: '1rem'}}>
                            <h2><strong>You have {balance} points</strong></h2>
                        </div>
                        <input type='range'  className={classes.slider} min={minPoint} max={maxPoint} step={stepPoint}
                               value={rewardPoint || rewardPointData.pointSpent}
                               id='myRange'
                               onChange={(e) => {
                                   setRewardPoint(e.target.value)
                               }}
                        />
                        <div style={{marginTop: '2rem', marginBottom: '2rem'}}>
                            <span>You are using </span>
                            <input
                                value={rewardPoint || rewardPointData.pointSpent}
                                onChange={(e) => {
                                    setRewardPoint(e.target.value)
                                }}
                            />
                        </div>
                        <Button
                            priority='high'
                            onClick={() => {
                                spendRewardPoint({variables: {
                                        cart_id: cartId,
                                        points: rewardPoint,
                                        rule_id: 'rate',
                                        address_information: {}
                                    }})
                            }}>
                            Apply
                        </Button>

                    </Section>
                </Accordion>
            </div>
        );
    }
    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section
                    id={'shipping_method'}
                    title={'Estimate your Shipping'}
                >
                    <ShippingMethods setIsCartUpdating={setIsCartUpdating} />
                </Section>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode setIsCartUpdating={setIsCartUpdating} />
                </Section>
                <GiftCardSection setIsCartUpdating={setIsCartUpdating} />
                <Section id={'gift_options'} title={'See Gift Options'}>
                    <GiftOptions />
                </Section>
                <Section id={'reward_points'} title={'Spend Your Points'}>
                    {RewardPointMethod}

                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setIsCartUpdating: func
};
