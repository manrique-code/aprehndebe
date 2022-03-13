const {ObjectId} = require("mongodb");
const getDb =  require("../mongodb");
let db =  null;


class TareasAsig{
    collection =null;

    constructor(){
        getDb()
        .then((database)=>{
            db = database;
            this.collection = db.collection("Matriculas");
        }).catch((err)=>{
            console.error(err);
        })
    }

    /**
     * 
     * @param {String} idClase utilizamos el identificador de clase para encontrar la matricula
     * @param {String} idEstudiante utilizamos el identificador de estudiante para encontrar la matricula
     * @param {String} numeroTarea codigo generado de la tarea asignada en CLASE
     * @param {String} fechaEntrega fecha en la que el estudiante entrega esta tarea
     * @param {String} documentoURL archivo que contiene la tarea
     * @param {String} estado estado de la tarea, atrasado o a tiempo
     * @returns Object
     */
    async newEntrega(idClase,idEstudiante,numeroTarea,fechaEntrega,documentoURL,estado){
        const filter = {
            "idClase": new ObjectId(idClase),
            "idEstudiante": new ObjectId(idEstudiante)
        }
        const updateCmd = {
             "$push":{
                 "tareaEntregable" : {
                     numeroTarea,
                     fechaEntrega,
                     documentoURL,
                     estado,
                 }
             }
        }
        const rslt =  await this.collection.updateOne(filter,updateCmd);
        return rslt;
    }
    
    /**
     * 
     * @param {String} idClase utilizamos el identificador de clase para encontrar la matricula
     * @param {String} idEstudiante utilizamos el identificador de estudiante para encontrar la matricula
     * @param {String} numeroTarea codigo generado de la tarea asignada en CLASE
     * @param {String} fechaEntrega fecha en la que el estudiante entrega esta tarea
     * @param {String} documentoURL archivo que contiene la tarea
     * @param {String} estado estado de la tarea, atrasado o a tiempo
     * @returns Object
     */
    async updateEntrega(idClase,idEstudiante,numeroTarea,fechaEntrega,documentoURL,estado){
        const filter = {
            "idClase": new ObjectId(idClase),
            "idEstudiante": new ObjectId(idEstudiante),
            "tareaEntregable.numeroTarea":numeroTarea
        }
        const updateCmd={
            $set:{
                "tareaEntregable.$.documentoURL":documentoURL,
                "tareaEntregable.$.fechaEntrega":fechaEntrega
            }

        }
        const rslt = await this.collection.updateOne(filter,updateCmd);
        return rslt;

    }
}

module.exports = TareasAsig;