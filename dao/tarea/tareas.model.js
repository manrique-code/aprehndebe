const ObjectId = require("mongodb").ObjectId;
const getDb =  require("../mongodb");
let db = null;

class Tareas {
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



    //CREAR METODO PARA INSERTAR CLASES

    /**
     * 
     * @param {String} id Identificador de la clases
     * @param {String} fechaAsignada fecha en la que se asigna la tarea
     * @param {String} fechaEntrega fecha limite para la entrega de la tarea
     * @param {String} estado Evalua si la tarea se entrega a tiempo
     * @param {Object} info Informacion de la tarea
     * @returns {Object}
     */
    
    async newTarea(id,fechaAsignada,fechaEntrega,estado,info){
    
        const filter = {"_id": new ObjectId(id)};
        const tareas = await this.collection.findOne(filter)
        const numeroTarea =tareas.tareaAsignada.length+1;
        const tareaCmd = {
            "$push":{
                "tareaAsignada":{
                    numeroTarea,
                    fechaAsignada,
                    fechaEntrega,
                    estado,
                    info
                }
            }
        }
        const rslt = await this.collection.updateOne(filter,tareaCmd);
        return rslt;
    }

    async updateTareaAsig(id,fechaAsignada,fechaEntrega,estado,info,numeroTarea){
        const filter = {
            "_id":new ObjectId(id),
            "tareaAsignada.numeroTarea":numeroTarea
        }
        const updateCmd={
                "$set":{
                    "tareaAsignada.$":{
                        numeroTarea,
                        fechaAsignada,
                        fechaEntrega,
                        estado,
                        info
                    }
                }
        }
        const rslt = await this.collection.update(filter,updateCmd);
        return rslt;
    }

    async allTareasClase(id){
        const filter = {"_id":new ObjectId(id)}
        const tareas = await this.collection.findOne(filter)
        return tareas.tareaAsignada;
    }


}

module.exports = Tareas;