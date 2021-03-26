import React, {useState} from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import {shape, string} from "prop-types";
import defaultClasses from "./index.css";
import {Title} from "@magento/venia-ui/lib/components/Head";
import {useIntl} from "react-intl";
import LinkButton from "@magento/venia-ui/lib/components/LinkButton";
import Checkbox from "@magento/venia-ui/lib/components/Checkbox";
import Button from '@magento/venia-ui/lib/components/Button';
import {useGetRewardPointData} from "../../talons/useGetRewardPointData";
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const RewardPoint = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const {
        handleViewAll,
        mpRewardPoints,
        rewardPointData,
        rewardPointLoading,
        rewardPointError
    } = useGetRewardPointData();
    if(rewardPointLoading){
        return 'loading...'
    }
    if(rewardPointError){
        return ''
    }
    if(!rewardPointData){
        return ''
    }
    let history = useHistory();
    const customerRewardPointData = rewardPointData.customer.mp_reward;
    const {point_balance, point_earned, point_spent, current_exchange_rates, notification_update, notification_expire } = customerRewardPointData;
    console.log(customerRewardPointData)
    const PAGE_TITLE = formatMessage({
        id: 'rewardPoint',
        defaultMessage: 'My Points and Rewards'
    });

    let isUpdate, isExpire;
    const title = `${PAGE_TITLE} - ${STORE_NAME}`;

    if(notification_update == 1){
        isUpdate = true;
    }
    else isUpdate = false;
    if(notification_expire == 1){
        isExpire = true;
    }
    else isExpire = false;

    const transactions = customerRewardPointData.transactions.items;

    const transactionRow = transactions.map((transaction) => {
        const date = transaction.created_at;
        const dateFormat = moment(date).format('YYYY/MM/DD');

        const expireDate = transaction.expiration_date;
        const expireDateFormat = moment(expireDate).format('YYYY/MM/DD');

        let rewardStatus, expireDateString;
        if(transaction.status == 1){
            rewardStatus = 'Pending'
        }
        else if(transaction.status == 2){
            rewardStatus = 'Completed'
        }
        else rewardStatus = 'Expired'

        if(expireDateFormat == 'Invalid date'){
            expireDateString = 'N/A'
        }
        else expireDateString = expireDateFormat
        return (
            <tr>
                <th>{transaction.transaction_id}</th>
                <th>{dateFormat}</th>
                <th>{transaction.comment}</th>
                <th>{transaction.point_amount}</th>
                <th>{rewardStatus}</th>
                <th>{expireDateString}</th>
            </tr>
        );
    });

    return (
        <section>
            <Title>{title}</Title>
            <div className={classes.title}>{PAGE_TITLE}</div>
            <div className={classes.flex_container} style={{marginBottom: '50px'}}>
                <div className={classes.block1}>
                    <div className={classes.point1}>
                        <span><strong>{point_balance} points</strong></span>
                    </div>
                    <div className={classes.label}>
                        <span>Available Balance</span>

                    </div>
                </div>

                <div className={classes.block2}>
                    <div className={classes.point2}>
                        <span><strong>{point_earned} points</strong></span>
                    </div>
                    <div className={classes.label}>
                        <span>Total Earned Points</span>

                    </div>
                </div>

                <div className={classes.block3}>
                    <div className={classes.point3}>
                        <span><strong>{point_spent} points</strong></span>
                    </div>
                    <div className={classes.label}>
                        <span>Total Spent Points</span>

                    </div>
                </div>
            </div>
            <div style={{margin: '20px'}}>
                <div style={{borderBottom: '1px solid #c6c6c6', marginBottom: '25px', paddingBottom: '10px', color: 'blue', fontSize: '20px'}}>
                    Reward Information
                </div>
                <div style={{marginBottom: '20px'}}>
                    <span><strong>Current Exchange Rates:</strong></span>
                </div>
                <span>{current_exchange_rates.earning_rate}</span>
                <br />
                <br />
                <span>{current_exchange_rates.spending_rate}</span>
            </div>

            <div style={{marginTop: '40px', marginLeft: '20px'}}>
                <div style={{borderBottom: '1px solid #c6c6c6', marginBottom: '25px', paddingBottom: '10px', color: 'blue', fontSize: '20px'}}>
                    <span style={{marginRight: '20px'}}>Recent Transaction</span>
                    <LinkButton onClick={handleViewAll}><span style={{fontSize: '20px', textDecorationLine: 'none'}}>View All</span></LinkButton>
                </div>
                <div>
                    <table style={{width: '100%'}}>
                        <thead>
                        <tr>
                            <th>Transaction</th>
                            <th>Date</th>
                            <th>Comment</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Expire Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactionRow}
                        </tbody>
                    </table>
                </div>

            </div>

            <div style={{marginTop: '40px', marginLeft: '20px'}}>
                <div style={{borderBottom: '1px solid #c6c6c6', marginBottom: '25px', paddingBottom: '10px', color: 'blue', fontSize: '20px'}}>
                    <span style={{marginRight: '20px'}}>Email Notification</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <Checkbox
                        initialValue={isUpdate}
                        label="Subcribe to balance update"
                        onClick={()=>{
                            isUpdate = !isUpdate;
                        }}
                    />
                    <Checkbox
                        initialValue={isExpire}
                        label="Subcribe to points experation notification"
                        onClick={()=>{
                            isExpire = !isExpire
                        }}
                    />
                </div>
                <Button
                    priority='high'
                    onClick={() => {
                        mpRewardPoints({variables: {isUpdate, isExpire}});
                    }}>
                    Save
                </Button>

            </div>
        </section>
    );
}
RewardPoint.propTypes = {
    classes: shape({root: string})
};

RewardPoint.defaultProps = {};

export default RewardPoint;
