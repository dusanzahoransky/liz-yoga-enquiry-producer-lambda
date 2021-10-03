import {Enquiry} from './Enquiry'
import {EnquiryDto} from './EnquiryDto'
import AWS from 'aws-sdk'

export class EnquiryService {

    async processEnquiry(enquiryDto: EnquiryDto){
        const enquiryTable = EnquiryService.getEnquiryTable()

        const dynamoDb = new AWS.DynamoDB.DocumentClient( {region: 'ap-southeast-2'} );

        const now = new Date()
        const partitionKey = EnquiryService.createPartitionKey(now);
        const sortKey = EnquiryService.createSortKey(now, enquiryDto.mobile);

        const enquiry: Enquiry = {
            partitionKey,
            sortKey,
            ...enquiryDto
        }

        const putItemReq = {
            TableName: enquiryTable,
            Item: enquiry
        };
        await dynamoDb.put(putItemReq).promise()

        return enquiry
    }

    private static getEnquiryTable(): string{
        const enquiryTable = process.env.ENQUIRY_TABLE
        if(!enquiryTable){
            throw new Error('Missing ENQUIRY_TABLE env var')
        }
        return enquiryTable
    }

    private static createPartitionKey(now: Date) {
        return now.toISOString().slice(0, 10);  //iso date part 2020-10-03
    }

    private static createSortKey(now: Date, mobile: string) {
        const isoTimePart = now.toISOString().slice(11, 19); //iso date part 09:12:28
        return isoTimePart + '_' + mobile;
    }
}