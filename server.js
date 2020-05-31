const {Client} = require('pg'); 
const express = require ("express");
const app = express();
app.use(express.json())

const client = new Client({
    user: "postgres",
    password: "anjali@64",
    port: 5432,
    database: "phone-web"
})

app.get("/",(req,res) => res.sendFile(`${__dirname}/index.html`))

app.get("/contact", async (req, res) => {
    const rows = await readPractice();
    res.setHeader("content-type","application/json")
    res.send(JSON.stringify(rows))
})

app.post("/contact", async (req, res) => {
    let result={}
    try{

        const reqJson = req.body;
        await createPractice(reqJson.name,reqJson.phone,reqJson.email,reqJson.dob);
        result.success=true;
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
})

app.delete("/contact", async (req, res) => {
    let result={}
    try{
        const reqJson = req.body;
        await deletePractice(reqJson.name);
        result.success=true;
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
})

app.listen(3200, () => console.log("Web server is listening.. on port 3200"));

start()

async function start(){
    await connect();

    // const practicee = await readPractice();
    // console.log(practicee);

    // const succCr = await createPractice("Paa");
    // console.log(`Creating was ${succCr}`)

    // const succD = await deletePractice(6);
    // console.log(`deleting was ${succD}`)

    // await client.end(); 
}

async function connect(){
    try{
        await client.connect();
    }
    catch(er){
        console.log(`Error occurse ${er}`)
    }
}

async function readPractice(){
    try{
        await connect();
        const results = await client.query("select * from contact")
        return results.rows;
    }
    catch(e){
        return e;
    }
}

async function createPractice(name,phone,email,dob){
    try{
        await connect();
        const results = await client.query("insert into contact values($1,$2,$3,$4)",[name,[phone],[email],dob])
        return results.row;
    }
    catch(e){ 
        return e;
    }
}

async function deletePractice(name){
    try{
        await connect();
        const results = await client.query("delete from contact where name = $1", [name]);
        return results.row;
    }
    catch(e){
        return e;
    }
}