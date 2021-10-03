import * as cdk from '@aws-cdk/core';
import {EnquiryServiceConstruct} from "./enquiry-service-construct";

export class LizYogaEnquiryServiceLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new EnquiryServiceConstruct(this, 'EnquiryService')
  }
}
