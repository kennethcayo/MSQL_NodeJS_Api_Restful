//Archivo de entrada

//Invocar paquetes
var express = require('express');
var mysql = require('mysql')
var cors = require('cors');

//referencia al contructor de express
//Creacion de un objeto para que el servidor pueda a acceder a todos los metodos
//y propiedades de la libreria express
var app = express();
//################################################################
//Como vamos a enviar desde postamn en formato JSON hay q decir a la aplicacioon que vamos a mandar en formato JSON
app.use(express.json());

app.use(cors());


//Conexion a la base de datos 
//Establecemos los parametros de conexion
var conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login'
});

//Ahora la llamamos
conexion.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log("Conexion a la base de datos establecida");
    };
});

//Si el puerto que estamos utilizando esta ocupado entonces
//vamos a crear una variable de entorno   
const puerto = process.env.PUERTO || 3000;

//Requiere el puerto y una funcion que puede recoger o imprimir cualquier salida para saber si el servidor
// se esta ejecutando xorrectamento o si hay un error en el servidor
app.listen(puerto, function () {
    console.log("Servidor funciona :) " + puerto); //Mensaje por consola
});

//Configuar las rutas
app.get('/', function (req, res) {
    res.send('Ruta de inicio');
})

//Metodo para mostrar todos los articulos
app.get('/api/empleado', (req, res) => {
    conexion.query('SELECT * FROM empleado', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    });
});

//Metodo para mostrar un articulo
app.get('/api/empleado/:id', (req, res) => {
    //req.params.id = para capturar el id
    conexion.query('SELECT * FROM empleado WHERE id = ?',[req.params.id], (error, fila) => { //Cuando hablamos de fila hacemos referencia al registro
        if (error) {
            throw error;
        } else {
            res.send(fila);
            res.send(fila[0].correo); //Se optiene un campo
        }
    }); 
});

//Crear un articulo
app.post('/api/empleado', (req, res) => {
    //Variables con let
    let data = {usuario:req.body.usuario, correo:req.body.correo, contrasena: req.body.contrasena, nacimiento: req.body.nacimiento, sexo: req.body.sexo}
    let sql = 'INSERT INTO empleado SET ?'; //El simpbolo de interrogacion sirve para definir todos los parametros de arriba de data
    conexion.query(sql, data, function(error, results){
        if (error) {
            throw error;
        } else {
            res.send(results);
        };
    });
});

//Editar articulos
app.put('/api/empleado/:id', (req, res) => {
    //Para capturar parametros
    let id = req.params.id;
    let usuario = req.body.usuario;
    let correo = req.body.correo;
    let contrasena = req.body.contrasena;
    let nacimiento = req.body.nacimiento;
    let sexo = req.body.sexo;
    //La sentencia para actualizar
    let sql = 'UPDATE empleado SET usuario =?, correo =?, contrasena = ? , nacimiento =?, sexo =? WHERE id= ?';
    conexion.query(sql, [usuario, correo, contrasena, nacimiento,sexo,id],function(error,results){
        if (error) {
            throw error;
        } else {
            res.send(results);
        };
    });
});

//Eliminar un articulo
app.delete('/api/empleado/:id', (req, res) => {
    conexion.query('DELETE FROM empleado WHERE id=?', [req.params.id], function(error, filas){
        if (error) {
            throw error;
        } else {
            res.send(filas);
        };
    });
});