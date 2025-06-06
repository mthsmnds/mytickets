import prisma from "../src/database/index";
import app from "../src/app";
import supertest from "supertest";
import {faker} from "@faker-js/faker"
import { createFactoryEventBody } from "./factories/event-factory";

const api = supertest(app); //sobe o app e fornece api de acesso

beforeEach(async()=>{
    await prisma.event.deleteMany();
    await prisma.ticket.deleteMany();
})
afterAll(async()=>{
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
})

describe("POST /events", ()=>{
    it("deve criar corretamente novo evento", async()=>{
        const event1 = createFactoryEventBody();
        const event2 = createFactoryEventBody();
        
        const post1 = await api.post(`/events`).send(event1)
        expect(post1.status).toBe(201);

        event2.name = event1.name

        const post2 = await api.post(`/events`).send(event2)
        expect(post2.status).toBe(409);

    })

})

describe("GET /events/:id", () =>{
    it("deve não encontrar evento com id especificado", async()=>{
        const {status} = await api.get(`/events/0`);
        expect(status).toBe(400);
    });
});


describe("DELETE /events", ()=>{
    it("deve falhar ao deletar um evento que não existe", async()=>{
        const deleted = await api.delete(`/events/0`)
        expect(deleted.status).toBe(400);
    })
})