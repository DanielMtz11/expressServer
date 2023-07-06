const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const app = express();

//*express esta hecho a base de middlewares, un middlewire es una funcion , existen 3 tipos:

//? middlewares de aplicacion
//? middlewares incorporados
//? middlewares de terceros


//tienen un punto de montajes : es la ruta en la que estaran escuchando una peticion



//*UTILIZAMOS UN MIDDLEWARE INCORPORADO
//app.use --> atiende todo tipo de peticiones
//express.json --> 
app.use(express.json());



const jsonPath = path.resolve("./files/users.json");
console.log(jsonPath);

app.get("/users", async (req, res) => {
    const users = await fs.readFile(jsonPath, "utf8");
    res.send(users);
    // console.log(users);
});



//creacion de usuarios dentro del json
app.post("/users", async(req, res)=>{
    // console.log("post");    
    //*en un post nos envian la data dentro del body de la peticion
    const user = req.body;

    //*convertir la data proveniente de jsonPath a un array []
    const arrUsers = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

    const lastUser = arrUsers.length -1;
    const newId = arrUsers[lastUser].id +1;


    //agregar el user al arreglo con su nuevo id
    arrUsers.push({...user, id:newId});


    //escribir wl nuevo id dentro del jsonPath//users.json
    await fs.writeFile(jsonPath, JSON.stringify(arrUsers));
    // res.send(arrUsers)---->visualizar el post
    // console.log(arrUsers);
    res.end();
})  

app.put("/users",  async(req, res)=>{

    const userReq = req.body;
    const arrUsers = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
    // console.log(`this is the id of user:${userReq.id}`)
    arrUsers.forEach(user => {
        console.log(user.id);

        if(user.id === userReq.id )
        {
            user.name = userReq.name;
            user.age = userReq.age;
            user.country = userReq.country;
        }
        
        else{
            res.send("id dont exist")
        }
        
        // await fs.writeFile(jsonPath, JSON.stringify(arrUsers));
        
        // res.send(arrUsers);
    });
    console.log(arrUsers);
    await fs.writeFile(jsonPath, JSON.stringify(arrUsers));

    res.send(arrUsers);
});



app.delete("/users", async (req,res)=>{
    const arrUsers = JSON.parse( await fs.readFile(jsonPath, "utf-8"));
    const {id} = req.body;

    console.log(id)
    

    const indexUser = arrUsers.findIndex(user => user.id === id);
    console.log(arrUsers[indexUser]);

    arrUsers.splice(indexUser, 1);
    console.log(arrUsers);
    await fs.writeFile(jsonPath, JSON.stringify(arrUsers));
    res.send(arrUsers);

    res.end();
});


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`server listen in the ${PORT} PORT`);
});



