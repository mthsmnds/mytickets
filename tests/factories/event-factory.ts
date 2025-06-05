import { CreateEventData } from "../../src/repositories/events-repository";
import prisma from "../../src/database/index";
import {faker} from "@faker-js/faker"


export function createFactoryEventBody(): CreateEventData {
    return({
            name: faker.music.album(),
            date: faker.date.soon()
        });
}

export async function createFactoryEvent(){
    const {name, date} = createFactoryEventBody();
    const event = await prisma.event.create({
        data:{
            name,
            date
        }
    });

    return event;
}