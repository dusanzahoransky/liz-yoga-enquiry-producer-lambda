import {EnquiryDto} from "./EnquiryDto";

export enum YogaClass {
    'groups-in-person',
    'groups-online',
    'poses-online',
    'private-in-person',
    'private-online'
}

export interface Enquiry extends EnquiryDto{
    /**
     * date, e.g. 2021-10-03
     */
    partitionKey: string,
    /**
     * time-phone, e.g. 10:00:00-0484123456, this will allow a unique entry per second and phone number + order it by date time when querying
     */
    sortKey: string,
}