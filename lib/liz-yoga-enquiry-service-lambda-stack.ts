import {EnquiryServiceConstruct} from "./enquiry-service-construct";
import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";

export class LizYogaEnquiryServiceLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new EnquiryServiceConstruct(this, 'EnquiryService')
  }
}
