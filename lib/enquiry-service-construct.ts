import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class EnquiryServiceConstruct extends core.Construct {
    constructor(scope: core.Construct, id: string) {
        super(scope, id);

        const bucket = new s3.Bucket(this, "EnquiryService");

        const enquiryTable = new dynamodb.Table(this, 'Enquiry', {
            tableName: 'Enquiry',
            partitionKey: { name: 'partitionKey', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sortKey', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const handler = new lambda.Function(this, "EnquiryServiceHandler", {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("src"),
            handler: "EnquiryServiceHandler.main",
            environment: {
                BUCKET: bucket.bucketName,
                ENQUIRY_TABLE: enquiryTable.tableName
            }
        });

        bucket.grantReadWrite(handler);

        const api = new apigateway.RestApi(this, "enquiry-api", {
            restApiName: "EnquiryDto Service",
            description: "Yoga Classes EnquiryDto Service.",
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS
            }
        });

        const getEnquiryIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });

        api.root.addMethod("POST", getEnquiryIntegration);

        // @ts-ignore
        enquiryTable.grantFullAccess(handler)
    }
}