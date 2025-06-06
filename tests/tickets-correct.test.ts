import prisma from "../src/database/index";
import app from "../src/app";
import supertest from "supertest";
import {faker} from "@faker-js/faker"
import { createFactoryMultTickets, createFactoryTicket, createFactoryTicketBody } from "./factories/ticket-factory";
import { createFactoryEvent } from "./factories/event-factory";

const api = supertest(app); //sobe o app e fornece api de acesso

beforeEach(async()=>{
    await prisma.event.deleteMany();
    await prisma.ticket.deleteMany();
})
afterAll(async()=>{
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
})

describe("POST /tickets", ()=>{
    it("deve criar corretamente novo ticket", async()=>{
        const data = await createFactoryTicketBody();
        const {status} = await api.post(`/tickets`).send(data)
        expect(status).toBe(201);

        const wasCreated = await prisma.ticket.findFirst({
            where: {owner: data.owner, code: data.code, eventId: data.eventId}
        });
        expect(wasCreated).not.toBeNull();
    })
})


describe("GET /tickets/:eventId", () =>{
    it("deve retornar todos os tickets de um evento", async()=>{
        const {event, tickets} = await createFactoryMultTickets(3);

        const {status, body} = await api.get(`/tickets/${event.id}`);
        expect(status).toBe(200);

        for(const ticket of tickets){
            expect(body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: ticket.id,
                        owner: ticket.owner,
                        code: ticket.code,
                        used: ticket.used,
                        eventId: ticket.eventId
                    })
                ])
            )
        }
    });
});


describe("PUT /tickets", ()=>{
    it("deve editar corretamente um ticket para used: true", async()=>{
        const data = await createFactoryTicketBody();
        const {status} = await api.post(`/tickets`).send(data)
        expect(status).toBe(201);
        const ticket = await prisma.ticket.findFirst({
            where: {code:data.code}
        });
        expect(ticket).not.toBeNull();

        const usedTicket = {...data, used:true}
        const update = await api.put(`/tickets/use/${ticket.id}`).send(usedTicket);
        expect(update.status).toBe(204);

        const wasUpdated = await prisma.ticket.findUnique({
            where: {id: ticket.id}
        });
        expect(wasUpdated.used).toBe(true);
    });
});
