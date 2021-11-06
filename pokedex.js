const { response } = require("express");
const express = require('express')
const pokedex = express()
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
norConstID = 1;

pokedex.engine("html", require("ejs").renderFile);
pokedex.set("view engine", "html");
pokedex.set("views", __dirname+"/views");

pokedex.use(express.static('public'))
pokedex.use(bodyParser.urlencoded({extended:true}));

function pokemonrender(req, res, next) {
    next();
    const list = [];
    const url = "https://pokeapi.co/api/v2/pokemon/"+norConstID;
    https.get(url, (response)=>{
        response.on("data", (data) =>{
            list.push(data);
        });
        response.on("end",()=> {
            const Req = Buffer.concat(list);
            const Data = JSON.parse(Req);

            const { types, abilities, moves } = Data;

            const Name = Data.name;
            const Img = Data.sprites.front_default;
            const Id = Data.id;
            norConstID = Id;
            const Types = [];
            const TypesColors = [];
            types.forEach(type => {
                Types.push(type.type.name);
            });
            const Weight = Data.weight;
            const Height = Data.height;
            const Experience = Data.base_experience;
            const Abilities = [];
            abilities.forEach(ability => {
                Abilities.push(ability.ability.name);
            });
            const Moves = [];
            moves.forEach(move => {
                Moves.push(move.move.name);
            });

            res.render("index.html", {
                ID:norConstID,
                Img:Img,
                Name:Name,
                Types:Types,
                Experience:Experience,
                Weight:Weight,
                Height:Height,
                Moves:Moves,
                Abilities:Abilities
            });
        })
    })
}

pokedex.post('/after', pokemonrender, (req, res) => {
    if (norConstID == 898){
        norConstID = 1;
    } else {
        norConstID +=1 ;
    }
})

pokedex.post('/before', pokemonrender, (req, res) => {
    if (norConstID == 1){
        norConstID=898;
    } else {
        norConstID -= 1;
    }
})

pokedex.post('/pokemon', (req, res) => {
    const list = [];
    const url = `https://pokeapi.co/api/v2/pokemon/${req.body.pokemon}`
    https.get(url, (response)=>{
        response.on("data", (data) =>{
            list.push(data);
        });
        response.on("end",()=> {
            try{
                const Req = Buffer.concat(list);
                const Data = JSON.parse(Req);

                const { types, abilities, moves } = Data;

                const Name = Data.name;
                const Img = Data.sprites.front_default;
                const Id = Data.id;
                norConstID = Id;
                const Types = [];
                const TypesColors = [];
                types.forEach(type => {
                    Types.push(type.type.name);
                });
                const Weight = Data.weight;
                const Height = Data.height;
                const Experience = Data.base_experience;
                const Abilities = [];
                abilities.forEach(ability => {
                    Abilities.push(ability.ability.name);
                });
                const Moves = [];
                moves.forEach(move => {
                    Moves.push(move.move.name);
                });

                res.render("index.html", {
                    ID:norConstID,
                    Img:Img,
                    Name:Name,
                    Types:Types,
                    Experience:Experience,
                    Weight:Weight,
                    Height:Height,
                    Moves:Moves,
                    Abilities:Abilities
                });
            } catch (error) {
                norConstID = 1;
                res.render("NotFound.html")
            } 
        })
    })
})

pokedex.get('/', pokemonrender,  (req, res) => {
    console.log("Loading...")
});

pokedex.listen(5000)