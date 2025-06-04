import prisma from "../src/database/index";
import app from "../src/app";
import supertest from "supertest";
import { createFactoryEvent, createFactoryEventBody } from "./factories/event-factory";

const api = supertest(app); //sobe o app e fornece api de acesso

beforeEach(async()=>{
    await prisma.event.deleteMany();
})
afterAll(async()=>{
    await prisma.event.deleteMany();
})

describe("POST /events", ()=>{
    it("deve criar novo evento", async()=>{
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