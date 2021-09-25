export class EnquiryService {

    processEnquiry(body: any): any{
        return { result: `processed ${JSON.stringify(body)}`}
    }

}