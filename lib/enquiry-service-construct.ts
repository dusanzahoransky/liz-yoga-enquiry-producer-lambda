import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";

export class EnquiryServiceConstruct extends core.Construct {
    constructor(scope: core.Construct, id: string) {
        super(scope, id);

        const bucket = new s3.Bucket(this, "EnquiryService");

        const handler = new lambda.Function(this, "EnquiryServiceHandler", {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("src"),
            handler: "EnquiryServiceHandler.main",
            environment: {
                BUCKET: bucket.bucketName
            }
        });

        bucket.grantReadWrite(handler);

        const api = new apigateway.RestApi(this, "enquiry-api", {
            restApiName: "Enquiry Service",
            description: "Yoga Classes Enquiry Service."
        });

        const getEnquiryIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });

        api.root.addMethod("POST", getEnquiryIntegration);
    }
}