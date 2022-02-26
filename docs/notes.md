# Utilizando MongoDB de manera local.
### ¿Cómo debe ser el string de conexión?
Al momento de utilizar una instancia local de MongoDB el string de conexión se debe realizar con la dirección IP del local host.
De la siguiente manera:
```
mongodb://127.0.0.1:27017/<database>
```

### ¿Cómo añadir un objeto a un arreglo de objetos
Para añadir un objeto a un arreglo de objetos tenemos que utilizar el operador ```$addToSet``` de la siguente manera:
```
db.Docentes.update({identidad:"0603200000415"}, {
    $addToSet: {
        "titulosAcademicos": {
            "tipo":"Postgrado",
            "nombre":"Maestría en Gestión de la Calidad"
        }
    }
});
```