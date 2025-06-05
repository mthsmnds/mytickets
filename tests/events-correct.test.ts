import prisma from "../src/database/index";
import app from "../src/app";
import supertest from "supertest";
import {faker} from "@faker-js/faker"
import { createFactoryEvent, createFactoryEventBody } from "./factories/event-factory";

const api = supertest(app); //sobe o app e fornece api de acesso

beforeEach(async()=>{
    await prisma.event.deleteMany();
})
afterAll(async()=>{
    await prisma.event.deleteMany();
})

describe("POST /events", ()=>{
    it("deve criar corretamente novo evento", async()=>{
        const data = createFactoryEventBody();
        const {status} = await api.post(`/events`).send(data)
        expect(status).toBe(201);

        const wasCreated = await prisma.event.findUnique({
            where: {name: data.name, date: data.date}
        });
        expect(wasCreated).not.toBeNull();
    })
})


describe("GET /events", () =>{
    it("deve retornar todos os eventos", async()=>{
    await createFactoryEvent(); 
    await createFactoryEvent(); 

    const {status, body} = await api.get(`/events`);

    expect(status).toBe(200);
    expect(body).toEqual(
        expect.arrayContaining([
        expect.objectContaining({
            name: expect.any(String),
            date: expect.any(String)
            })
        ])
    )
    });
});


describe("GET /events/:id", () =>{
    it("deve retornar um evento específico", async()=>{
        const event = await createFactoryEvent();

        const {status, body} = await api.get(`/events/${event.id}`);
        expect(status).toBe(200);
        expect(body).toMatchObject({
            id: event.id,
            name: body.name,
            date: body.date
        })
    });
});


describe("PUT /events", ()=>{
    it("deve editar corretamente o nome de um evento", async()=>{
        const data = createFactoryEventBody();
        const {status} = await api.post(`/events`).send(data)
        expect(status).toBe(201);
        const event = await prisma.event.findUnique({
            where: {name: data.name, date: data.date}
        });
        expect(event).not.toBeNull();

        
        const newNameSameDate = {name: faker.lorem.words(2), date: data.date}
        const update = await api.put(`/events/${event.id}`).send(newNameSameDate);
        expect(update.status).toBe(200);

        const wasUpdated = await prisma.event.findUnique({
            where: {id: event.id}
        });
        expect(wasUpdated.name).toBe(newNameSameDate.name);
    });
});


describe("PUT /events", ()=>{
    it("deve editar corretamente a data de um evento", async()=>{
        const data = createFactoryEventBody();
        const {status} = await api.post(`/events`).send(data)
        expect(status).toBe(201);
        const event = await prisma.event.findUnique({
            where: {name: data.name, date: data.date}
        });
        expect(event).not.toBeNull();


        const newDateSameName = {name: data.name, date: faker.date.future({years: 10})}
        const update = await api.put(`/events/${event.id}`).send(newDateSameName);
        expect(update.status).toBe(200);

        const wasUpdated = await prisma.event.findUnique({
            where: {id: event.id}
        });
        expect(wasUpdated.date.toString()).toBe(newDateSameName.date.toString());
    });
});


describe("PUT /events", ()=>{
    it("deve editar corretamente a data e o nome de um evento", async()=>{
        const data = createFactoryEventBody();
        const {status} = await api.post(`/events`).send(data)
        expect(status).toBe(201);
        const event = await prisma.event.findUnique({
            where: {name: data.name, date: data.date}
        });
        expect(event).not.toBeNull();


        const newDateAndName = {name: faker.lorem.words(2), date: faker.date.future({years: 10})}
        const update = await api.put(`/events/${event.id}`).send(newDateAndName);
        expect(update.status).toBe(200);

        const wasUpdated = await prisma.event.findUnique({
            where: {id: event.id}
        });
        expect(wasUpdated.name).toBe(newDateAndName.name);
        expect(wasUpdated.date.toString()).toBe(newDateAndName.date.toString());
    });
});


describe("DELETE /events", ()=>{
    it("deve deletar um evento", async()=>{
        const data = createFactoryEventBody();
        const {status} = await api.post(`/events`).send(data)
        expect(status).toBe(201);
        const event = await prisma.event.findUnique({
            where: {name: data.name, date: data.date}
        });
        expect(event).not.toBeNull()


        const deleted = await api.delete(`/events/${event.id}`)
        expect(deleted.status).toBe(204);

        const wasDeleted = await prisma.event.findUnique({
            where:{ id: event.id}
        });
        expect(wasDeleted).toBeNull();
    })
})