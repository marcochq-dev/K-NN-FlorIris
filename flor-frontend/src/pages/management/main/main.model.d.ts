export interface Ticket {
    ticketId?: number;
    parentId?: number;
    instance?: string;
    type: TicketType;
    status?: number; // BE
    statusName?: string;
    tickedIdName?: string;

    issuer?: string; // BE
    authorizer?: string; // BE
    assignee?: string; // BE

    createdAt?: Date;
    updatedAt?: Date;

    data: string;

    searchKeys?: string;

    sla?: Date;
    company?: string;
    priorityId?: number;

    issuerName?: string;
    authorizerName?: string;
    assigneeName?: string;

    //
    qaDetail?: string[];
    parentindexId?: number;
    timeWaiting?: string;
}