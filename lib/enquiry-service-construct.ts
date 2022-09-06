import {Construct} from "constructs";
import {aws_apigateway, aws_dynamodb, aws_lambda, aws_s3} from "aws-cdk-lib";
import {StreamViewType} from "aws-cdk-lib/aws-dynamodb";

export class EnquiryServiceConstruct extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const bucket = new aws_s3.Bucket(this, "EnquiryService");

        const enquiryTable = new aws_dynamodb.Table(this, 'Enquiry', {
            tableName: 'Enquiry',
            partitionKey: { name: 'partitionKey', type: aws_dynamodb.AttributeType.STRING },
            sortKey: { name: 'sortKey', type: aws_dynamodb.AttributeType.STRING },
            billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
            stream: StreamViewType.NEW_IMAGE
        });

        const handler = new aws_lambda.Function(this, "EnquiryServiceHandler", {
            runtime: aws_lambda.Runtime.NODEJS_14_X,
            code: aws_lambda.Code.fromAsset("src"),
            handler: "EnquiryServiceHandler.main",
            environment: {
                BUCKET: bucket.bucketName,
                ENQUIRY_TABLE: enquiryTable.tableName
            }
        });

        bucket.grantReadWrite(handler);

        const api = new aws_apigateway.RestApi(this, "enquiry-api", {
            restApiName: "EnquiryDto Service",
            description: "Yoga Classes EnquiryDto Service.",
            defaultCorsPreflightOptions: {
                allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
                allowMethods: aws_apigateway.Cors.ALL_METHODS
            }
        });

        const getEnquiryIntegration = new aws_apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });

        api.root.addMethod("POST", getEnquiryIntegration);

        // @ts-ignore
        enquiryTable.grantFullAccess(handler)
    }
}