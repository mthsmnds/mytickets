import prisma from "../../src/database/index";
import {faker} from "@faker-js/faker"
import { CreateTicketData } from "repositories/tickets-repository";
import { createFactoryEvent } from "./event-factory";


export async function createFactoryTicketBody(): Promise <CreateTicketData> {
    const event = await createFactoryEvent();
    return({
            code: faker.string.uuid(),
            owner: faker.person.fullName(),
            eventId:event.id 
        });
}


export async function createFactoryMultTickets(amount: number){
    const event = await createFactoryEvent();
    const tickets = [];

    for(let i = 0; i < amount; i++){
        const ticket = await prisma.ticket.create({
            data:{
                code: faker.string.uuid(),
                owner: faker.person.fullName(),
                eventId: event.id
            }
        });
        tickets.push(ticket);
    }

    return {event, tickets}
}