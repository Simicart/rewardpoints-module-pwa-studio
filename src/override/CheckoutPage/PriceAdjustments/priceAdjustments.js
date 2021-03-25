import React, {useState} from 'react';
import { func } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import GiftOptions from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions';

import defaultClasses from './priceAdjustments.css';
import {useMutation, useQuery} from "@apollo/client";
import {GET_RULE_APPLY, SPEND_REWARD_POINT} from "../../CartPage/PriceSummary/rewardpoint.gql";
import {GET_CUSTOMER_REWARD_POINTS} from "../../../components/RewardPoint/customerRewardPoints.gql";
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import Select from "react-select";

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ cartId }] = useCartContext();
    const { setPageIsUpdating } = props;
    const [rewardPoint, setRewardPoint] = useState(0)
    const [spendRewardPoint, {data: spendRewardPointData}] = useMutation(SPEND_REWARD_POINT, {onCompleted(){
            window.location.reload()
        }});
    const handleSetRewardPoint = (e) => {
        spendRewardPoint({variables: {
                cart_id: cartId,
                points: e.target.value,
                rule_id: rewardPointData.ruleApplied,
                address_information: {}
            }})
    }
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
        if(e.value == '2'){
            spendRewardPoint({variables: {
                    cart_id: cartId,
                    points: 0,
                    rule_id: '2',
                    address_information: {}
                }})
        }
    }
    if(!applyRuleData || !rewardPointCustomerData){
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
    const maxRewardPoint = rules.map(getRule)
    const RewardPointMethod =
        <Select options={labelRule}
                value={labelRule.find(obj => obj.value === selectedValue)}
                onChange={handleChange}
        />;
    if(selectedValue == 'no_apply'){
        return (
            <div className={classes.root}>
                <Accordion canOpenMultiple={true}>
                    <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                        <CouponCode setIsCartUpdating={setPageIsUpdating} />
                    </Section>
                    <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
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
                    <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                        <CouponCode setIsCartUpdating={setPageIsUpdating} />
                    </Section>
                    <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
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
                               onMouseUp={(e) => {
                                   spendRewardPoint({variables: {
                                           cart_id: cartId,
                                           points: e.target.value,
                                           rule_id: 'rate',
                                           address_information: {}
                                       }})
                               }}
                        />
                        <div style={{marginTop: '2rem'}}>
                            <span>You are using </span>
                            <input
                                value={rewardPoint || rewardPointData.pointSpent}
                                onChange={(e) => {
                                    setRewardPoint(e.target.value)
                                }}
                                onBlur={(e) => {
                                    spendRewardPoint({variables: {
                                            cart_id: cartId,
                                            points: e.target.value,
                                            rule_id: 'rate',
                                            address_information: {}
                                        }})
                                }}
                            />
                        </div>

                    </Section>
                </Accordion>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Accordion canOpenMultiple={true}>
                <Section id={'coupon_code'} title={'Enter Coupon Code'}>
                    <CouponCode setIsCartUpdating={setPageIsUpdating} />
                </Section>
                <GiftCardSection setIsCartUpdating={setPageIsUpdating} />
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
    setPageIsUpdating: func
};
