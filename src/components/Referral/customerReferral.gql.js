import { gql } from '@apollo/client';

export const GET_CUSTOMER_REFERRAL = gql`
    query getCustomerRewardPoints {
        customer {
            mp_reward {
                reward_id
                point_balance
                refer_code

            }
            email
        }
    }
`;

