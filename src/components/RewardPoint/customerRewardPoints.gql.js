    import { gql } from '@apollo/client';

    export const GET_CUSTOMER_REWARD_POINTS = gql`
        query getCustomerRewardPoints {
            customer {
                mp_reward {
                    reward_id
                    point_balance
                    customer_id
                    point_spent
                    point_earned
                    point_balance
                    notification_update
                    notification_expire
                    balance_limitation
                    earn_point_expire
                    current_exchange_rates {
                        earning_rate
                        spending_rate
                    }
                    transactions {
                        total_count
                        items {
                            transaction_id
                            reward_id
                            customer_id
                            action_code
                            action_type
                            store_id
                            point_amount
                            point_remaining
                            point_used
                            status
                            order_id
                            created_at
                            expiration_date
                            expire_email_sent
                            comment
                        }
                    }
                }
            }
        }
    `;

export const SET_REWARD_SUBSCRIBE_STATUS = gql`
    mutation setRewardSubscribeStatus(
        $isUpdate: Boolean!,
        $isExpire: Boolean!
    ) {
        MpRewardSubscribe(
            input: {
                isUpdate: $isUpdate,
                isExpire: $isExpire,
            }
        ) @connection(key: "Subscribe")
    }
`;
