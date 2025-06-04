import app from "../src/app";
import supertest from "supertest";

const api = supertest(app); //sobe o app e fornece api de acesso

describe("GET / health", () =>{
    it("retorna status 200 e mensagem", async()=>{
        const {status, text} = await api.get("/health");
        
        expect(status).toBe(200);
        expect(text).toBe(`I'm okay!`);
    });
});