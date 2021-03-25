import React from "react";
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import {shape, string} from "prop-types";
import {GET_CUSTOMER_REFERRAL} from "./customerReferral.gql";

import defaultClasses from "./index.css";
import {useQuery} from "@apollo/client";
import TextInput from "@magento/venia-ui/lib/components/TextInput";
import {isRequired} from "@magento/venia-ui/lib/util/formValidators";
import Field from "@magento/venia-ui/lib/components/Field";
import textArea from "@magento/venia-ui/lib/components/TextArea";
import Button from "@magento/venia-ui/lib/components/Button";

const Page1 = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        data: referralData
    } = useQuery(GET_CUSTOMER_REFERRAL);

    if(!referralData){
        return '';
    }

    const email = referralData.customer.email

    const referCode = referralData.customer.mp_reward.refer_code

    const baseUrl = window.location.origin

    const referUrl = baseUrl + "/?code=" + referCode

    console.log(referUrl)

        return (
            <section>
                <div style={{marginTop: '3rem'}}>
                    <h1 style={{color: 'red'}}> REFERRAL PROGRAM</h1>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{width: '30%', flex: '1 0 auto', marginTop: '5rem'}}>
                        <div style={{marginTop: '2rem', borderBottom: '1px solid #c6c6c6'}}><h2 style={{color: 'blue'}}>Referral URL and Code</h2></div>
                        <div style={{marginTop: '3rem'}}>
                            <Field label="Refer URL">
                                <TextInput
                                    initialValue={referUrl}
                                    disabled={true}
                                />
                            </Field>
                            <Field label="Refer Code">
                                <TextInput
                                    initialValue={referCode}
                                    disabled={true}

                                />
                            </Field>
                            <Field label="Refer Email">
                                <TextInput
                                    initialValue={email}
                                    disabled={true}
                                />
                            </Field>
                        </div>
                    </div>
                    <div style={{width: '40%', flex: '1 0 auto', marginTop: '5rem', marginLeft: '8rem'}}>
                        <div style={{marginTop: '2rem', borderBottom: '1px solid #c6c6c6'}}><h2 style={{color: 'blue'}}>Send Invitations</h2></div>
                        <div style={{marginTop: '3rem'}}>
                            <Field label="Send From">
                                <TextInput
                                    initialValue={email}
                                    disabled={true}
                                />
                            </Field>
                            <Field label="Invite your friends by entering their email addresses below">
                                <textArea/>
                            </Field>
                            <div style={{marginTop: '1rem'}}>
                                <span>To reduce the chance that your message is marked as spam, please follow this format: "Contact name"</span>
                                <br />
                                <br />
                                <span>Example contact list:"John" , peter@icloud.com,jennifer@google.com, hello@yahoo.com, mark@gmail.com</span>
                            </div>
                            <Button priority='high'>Send Now</Button>
                        </div>
                    </div>
                </div>
            </section>
        );
}

Page1.propTypes = {
    classes: shape({root: string})
};

Page1.defaultProps = {};

export default Page1;
