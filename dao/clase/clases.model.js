const ObjectId = require("mongodb").ObjectId;
const getDb =  require("../mongodb");
let db = null;

class Clases {
    collection = null;
    constructor(){
        getDb()
        .then((database)=>{
            db = database;
            this.collection = db.collection("Clases");
            if(process.env.MIGRATE ==="true"){
                // AUN NO SE REQUIERE NADA.
            }
        })
        .catch((err)=>{
            console.error(err);
        })
    }


    
}

module.exports = Clases;