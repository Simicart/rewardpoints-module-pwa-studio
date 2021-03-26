import React, {useState} from 'react';
import { func } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import CouponCode from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode';
import GiftCardSection from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/giftCardSection';
import GiftOptions from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/GiftOptions';

import defaultClasses from './priceAdjustments.css';
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import Select from "react-select";
import Button from "@magento/venia-ui/lib/components/Button";
import {usePriceSummary} from "../../../talons/usePriceSummary";
import {useGetRewardPointData} from "../../../talons/useGetRewardPointData";

/**
 * PriceAdjustments component for the Checkout page.

 * @param {Function} props.setPageIsUpdating callback that sets checkout page updating state
 */
const PriceAdjustments = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ cartId }] = useCartContext();
    const { setPageIsUpdating } = props;
    const [rewardPoint, setRewardPoint] = useState(0)
    const {
        spendRewardPoint,
        applyRuleData,
    } = usePriceSummary();
    const {
        rewardPointData
    } = useGetRewardPointData();
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
    if(!applyRuleData || !rewardPointData || !applyRuleData.data){
        return ''
    }
    const labelRule = [];
    const balance = rewardPointData.customer.mp_reward.point_balance;
    const rewardRulePointData = applyRuleData.data.MpRewardShoppingCartSpendingRules;
    let SpendingPoint;
    const rules = rewardRulePointData.rules;
    const maxRewardPoint = rules.map((rule)=>{
        if(rule.id == rewardRulePointData.ruleApplied){
            minPoint = rule.min;
            maxPoint = rule.max;
            stepPoint = rule.step;
        }
        const ruleLabel = rule.label;
        const ruleId = rule.id
        labelRule.push({value: ruleId, label: ruleLabel})
        return {minPoint, maxPoint, stepPoint}
    })
    const RewardPointMethod =
        <Select options={labelRule}
                value={labelRule.find(obj => obj.value === selectedValue)}
                onChange={handleChange}
        />;
    if(selectedValue == 'no_apply'){
        SpendingPoint = <Section id={'reward_points'} title={'Spend Your Points'}>
            {RewardPointMethod}
        </Section>
    }
    else if(selectedValue == 'rate'){
        SpendingPoint = <Section id={'reward_points'} title={'Spend Your Points'}>
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
    }
    else{
        SpendingPoint = <Section id={'reward_points'} title={'Spend Your Points'}>
            {RewardPointMethod}
        </Section>
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
                {SpendingPoint}
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setPageIsUpdating: func
};
