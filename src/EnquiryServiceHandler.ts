import { APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda"
import {EnquiryService} from "./EnquiryService";
import {EnquiryDto} from "./EnquiryDto";

exports.main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log(`consuming ${JSON.stringify(event)}`)

    if(event.httpMethod === 'POST' && event.body){

    } else{
        return {
            statusCode: 400,
            body: `Invalid request (method: ${event.httpMethod}, has body: ${!!event.body})`
        }
    }

    try {
        const reqBody = JSON.parse(event.body) as EnquiryDto
        const respEntity = await new EnquiryService().processEnquiry(reqBody)
        return {
            statusCode: 200,
            body: JSON.stringify(respEntity),
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            }
        }
    } catch (e) {
        let error = e as Error;
        console.log(e, error.stack)
        return {
            statusCode: 500,
            body: `Failed to process enquiry: ${error.message}`
        }
    }
}