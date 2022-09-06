import * as LizYogaEnquiryServiceLambda from '../lib/liz-yoga-enquiry-service-lambda-stack';
import {Template} from "aws-cdk-lib/assertions";
import {App} from "aws-cdk-lib";

test('Stack with Lambda', () => {
    const app = new App();
    // WHEN
    const stack = new LizYogaEnquiryServiceLambda.LizYogaEnquiryServiceLambdaStack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 1)
});



