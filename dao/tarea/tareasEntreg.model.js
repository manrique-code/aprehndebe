const {ObjectId} = require("mongodb");
const getDb = require("../mongodb");
const { isBefore } = require("date-fns")
let db = null;


class TareasEntregable {
    collection = null;
    collecitionClase = null;
    constructor() {
        getDb()
            .then((database) => {
                db = database;
                this.collection = db.collection("Matriculas");
                this.collecitionClase = db.collection("Clases");
            }).catch((err) => {
                console.error(err);
            })
    }

    /**
     * ENTREGA DE TAREAS
     * @param {String} idClase utilizamos el identificador de clase para encontrar la matricula
     * @param {String} idEstudiante utilizamos el identificador de estudiante para encontrar la matricula
     * @param {String} numeroTarea codigo generado de la tarea asignada en CLASE
     * @param {String} fechaEntrega fecha en la que el estudiante entrega esta tarea
     * @param {String} documentoURL archivo que contiene la tarea
     * @param {String} estado estado de la tarea, este debe recibir por defecto "entregado" o "entregado tarde"
     * @returns Object
     */
    async newEntrega(idClase, idEstudiante, numeroTarea, fechaEntrega, documentoURL) {
        //EVALUAR SI LA TAREA YA EXISTE
        const existCmd = [
            {
                $match: {
                    idClase: ObjectId(idClase),
                    idEstudiante: ObjectId(idEstudiante)
                }
            }, {
                $project: {
                    tareaEntregable: {
                        $filter: {
                            input: '$tareaEntregable',
                            as: 'tareaEntregable',
                            cond: {
                                $eq: [
                                    '$$tareaEntregable.numeroTarea',
                                    numeroTarea
                                ]
                            }
                        }
                    }
                }
            }
        ]
        const resExist = await this.collection.aggregate(existCmd).toArray()
        const existe = resExist.map((tareaEntregada) => {
            return tareaEntregada
        })
        const tareaExiste = existe[0].tareaEntregable

        //Se implemento esta condicion ya que los registros podian duplicarse y generaban conflicto al momento de revision del docente
        if (tareaExiste.length == 0) {
            //OBTENER FECHA DE ENTREGA
            //ESTRUCTURA DE LA CONSULTA
            const findCmd = [
                {
                    $match: {
                        _id: ObjectId(idClase)
                    }
                },
                {
                    $project: {
                        tareaAsignada: {
                            $filter: {
                                input: '$tareaAsignada',
                                as: 'tareaAsignada',
                                cond: {
                                    $eq: [
                                        '$$tareaAsignada.numeroTarea',
                                        numeroTarea
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
            //se ejecuta la consulta que extrae un arreglo especifico con la informacion de la tarea segun el codigo numeroTarea 
            const res = await this.collecitionClase.aggregate(findCmd).toArray();
            //mapeamos y extraemos la fecha limite de la tarea
            const fechalimite = res.map((tarea) => {
                const fecha = tarea?.tareaAsignada[0]?.fechaEntrega
                return fecha
            })
            //transformamos las cadenas de texto a formato fecha para evaluarlas con la funcion isBefore
            //isBefore como su nombre lo dice, retorna un booleano si cumple la condicion de que una fecha esta situada antes que otra en este caso
            //si la fecha en la que se entrega la tarea esta dentro del rango y antes de la fecha limite para entregar tareas
            const limite = new Date(fechalimite)
            const entrga = new Date(fechaEntrega)
            //EVALUAMOS PARA EL ESTADO DE LA TAREA ENTREGABLE, SI ESTA ESTA TARDE
            const estado = isBefore(entrga, limite) ? "entregado" : "tarde";

            //ENTREGA DE LA TAREA
            const filter = {
                "idClase": new ObjectId(idClase),
                "idEstudiante": new ObjectId(idEstudiante)
            }
            const updateCmd = {
                "$push": {
                    "tareaEntregable": {
                        numeroTarea,
                        fechaEntrega,
                        documentoURL,
                        estado,
                    }
                }
            }
            const rslt = await this.collection.updateOne(filter, updateCmd);
            return rslt;
        } else {
            return "Ya se entrego esta tarea"
        }
    }

    /**
     * ACTUALIZACION DE TAREAS ENTREGADAS
     * @param {String} idClase utilizamos el identificador de clase para encontrar la matricula
     * @param {String} idEstudiante utilizamos el identificador de estudiante para encontrar la matricula
     * @param {String} numeroTarea codigo generado de la tarea asignada en CLASE
     * @param {String} fechaEntrega fecha en la que el estudiante entrega esta tarea
     * @param {String} documentoURL archivo que contiene la tarea
     * @param {String} estado estado de la tarea, atrasado o a tiempo
     * @returns Object
     */
    async updateEntrega(idClase, idEstudiante, numeroTarea, fechaEntrega, documentoURL) {
        //OBTENER FECHA DE ENTREGA
        //ESTRUCTURA DE LA CONSULTA
        const findCmd = [
            {
                $match: {
                    _id: ObjectId(idClase)
                }
            },
            {
                $project: {
                    tareaAsignada: {
                        $filter: {
                            input: '$tareaAsignada',
                            as: 'tareaAsignada',
                            cond: {
                                $eq: [
                                    '$$tareaAsignada.numeroTarea',
                                    numeroTarea
                                ]
                            }
                        }
                    }
                }
            }
        ]
        //se ejecuta la consulta que extrae un arreglo especifico con la informacion de la tarea segun el codigo numeroTarea 
        const res = await this.collecitionClase.aggregate(findCmd).toArray();
        //mapeamos y extraemos la fecha limite de la tarea
        const fechalimite = res.map((tarea) => {
            const fecha = tarea?.tareaAsignada[0]?.fechaEntrega
            return fecha
        })
        //transformamos las cadenas de texto a formato fecha para evaluarlas con la funcion isBefore
        //isBefore como su nombre lo dice, retorna un booleano si cumple la condicion de que una fecha esta situada antes que otra en este caso
        //si la fecha en la que se entrega la tarea esta dentro del rango y antes de la fecha limite para entregar tareas
        const limite = new Date(fechalimite)
        const entrga = new Date(fechaEntrega)
        //EVALUAMOS PARA EL ESTADO DE LA TAREA ENTREGABLE, SI ESTA ESTA TARDE
        const estado = isBefore(entrga, limite) ? "entregado" : "tarde";

        const filter = {
            "idClase": new ObjectId(idClase),
            "idEstudiante": new ObjectId(idEstudiante),
            "tareaEntregable.numeroTarea": numeroTarea
        }
        const updateCmd = {
            $set: {
                "tareaEntregable.$.documentoURL": documentoURL,
                "tareaEntregable.$.fechaEntrega": fechaEntrega,
                "tareaEntregable.$.estado": estado
            }

        }
        const rslt = await this.collection.updateOne(filter, updateCmd);
        return rslt;

    }
    //El docente puede evaluar tareas
    async newEvaluacion(idClase, idEstudiante, numeroTarea, puntaje) {
        const filter = {
            "idClase": new ObjectId(idClase),
            "idEstudiante": new ObjectId(idEstudiante),
            "tareaEntregable.numeroTarea": numeroTarea
        }
        const updateCmd = {
            $set: {
                "tareaEntregable.$.Puntaje": puntaje

            }

        }
        const rslt = await this.collection.updateOne(filter, updateCmd);
        return rslt;
    }
}

module.exports = TareasEntregable;