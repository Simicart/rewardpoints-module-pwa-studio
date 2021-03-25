import { gql } from '@apollo/client';

export const GET_CUSTOMER_TRANSACTION = gql`
    query getCustomerTransaction($pageSize: Int!) {
        customer {
            mp_reward {
                transactions(pageSize: $pageSize) {
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

