import { gql } from '@apollo/client';

export const GET_CATEGORY = gql`
    query category(
        $id: Int!
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        category(id: $id) {
            id
            description
            name
            product_count
            meta_title
            meta_keywords
            meta_description
        }
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
                # id is always required, even if the fragment includes it.
                id
                # TODO: Once this issue is resolved we can use a
                # GalleryItemFragment here:
                # https://github.com/magento/magento2/issues/28584
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                small_image {
                    url
                }
                url_key
                url_suffix
                mp_reward {
                    earning_point
                    earning_point_format
                }
            }
            page_info {
                total_pages
            }
            total_count
        }
        MpRewardIcon {
            url
        }
    }
`;
