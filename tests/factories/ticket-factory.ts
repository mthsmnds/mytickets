import prisma from "../../src/database/index";
import {faker} from "@faker-js/faker"
import { CreateTicketData } from "repositories/tickets-repository";
import { createFactoryEvent } from "./event-factory";


export async function createFactoryTicketBody(): Promise <CreateTicketData> {
    const eventId = await createFactoryEvent();
    return({
            code: faker.string.uuid(),
            owner: faker.person.fullName(),
            eventId:eventId.id 
        });
}

export async function createFactoryTicket(){
    const eventId = await createFactoryEvent();
    const {code, owner} = await createFactoryTicketBody();
    const ticket = await prisma.ticket.create({
        data:{
            code,
            owner,
            used: false,
            eventId: eventId.id
        }
    });

    return ticket;
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