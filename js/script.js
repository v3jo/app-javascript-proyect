/*armado de la clase para generar estructura de los datos de cada partida*/

class Partida {
    constructor(campeon,rol,asesinatos, muertes,asistencias,id){
        this.campeon = campeon;
        this.rol = rol;
        this.asesinatos = parseInt(asesinatos);
        this.muertes = parseInt(muertes);
        this.asistencias = parseInt(asistencias);
        this.id=parseInt(id);
    }


}

const partidas = [
    new Partida('Swain','soporte',4,2,10,1),
    new Partida('Thresh','soporte',5,3,20,2),
    new Partida('Renata','soporte',1,3,5,3),
    new Partida('Renata','soporte',1,4,7,4),
    new Partida('Rakan','soporte',0,4,5,5),
    new Partida('Rakan','soporte',2,0,4,6),
]

/*-----Agarrar ID'S del HTML--------- */
const contenedorTabla = document.getElementById('cuerpoTabla');
const btnSubirDatos = document.getElementById('botonSubirDatos'),
nombreCamp = document.getElementById('campeon'),
nombreRol = document.getElementById('rol'),
cantMuertes = document.getElementById('muertes'),
cantAsesinatos = document.getElementById('asesinatos'),
cantAsistencias = document.getElementById('asistencias'),
form = document.getElementById('formDatos');




 /*--------------Guardar datos en el local storage----- */
 function guardarDatosChamp(usuarioDB, storage) {

    const partidaStorage = 
        {
            'champ': usuarioDB.campeon,
            'rol': usuarioDB.rol,
            'asesinatos': usuarioDB.asesinatos,
            'muertes': usuarioDB.muertes,
            'asistencias': usuarioDB.asistencias
        }
        const partidaStorageArray = JSON.parse(localStorage.getItem('partida')) || [];
        partidaStorageArray.push(partidaStorage);
        let partidaStorageArrayJSON = JSON.stringify(partidaStorageArray);
        storage.setItem('partida', partidaStorageArrayJSON);
    
    }

    
/*--------Mostrar informacion de los champs mediante Foreach----------- */
function mostrarInfoChamp(){
    let storagePartidaArray = JSON.parse(localStorage.getItem("partida"));
    let ultimaPartida = [storagePartidaArray.pop()];
    ultimaPartida.forEach(el=>{
        let fila = document.createElement('tr');
     fila.innerHTML = `<td>${el.champ}</td>
     <td>${el.rol}</td><td>${el.asesinatos}</td><td>${el.muertes}</td><td>${el.asistencias}</td>`;
     contenedorTabla.append(fila);
    });    
}
//ASync fetch

function getDataJson (){
    const url ="./js/data.json"
    fetch(url)
    .then(response => response.json().then(dataJson=>{
        dataJson.forEach(el=>{
            let fila = document.createElement('tr');
         fila.innerHTML = `<td>${el.campeon}</td>
         <td>${el.rol}</td><td>${el.asesinatos}</td><td>${el.muertes}</td><td>${el.asistencias}</td>`;
         contenedorTabla.append(fila);
         
        })
        generarDatosStorageTabla();
    }))
}



//Generar Tabla standard cuando el usuario esta logeado.
function generarDatosStorageTabla(){
    tablaIndex();  
        let containerTableArray = JSON.parse(localStorage.getItem("partida"));
        if(containerTableArray != null){
            containerTableArray.forEach(el=>{
                let fila = document.createElement('tr');
         fila.innerHTML = `<td>${el.champ}</td>
         <td>${el.rol}</td><td>${el.asesinatos}</td><td>${el.muertes}</td><td>${el.asistencias}</td>`;
         contenedorTabla.append(fila);
            })
        }
          
}

/*-----Generar la Tabla en el index */
function tablaIndex (){
    for(const item of partidas){
        let fila = document.createElement('tr');
         fila.id = `${item.id}`;
         fila.innerHTML = `<td>${item.campeon}</td>
         <td>${item.rol}</td><td>${item.asesinatos}</td><td>${item.muertes}</td><td>${item.asistencias}</td>`;
         contenedorTabla.append(fila)
    }
}

/*-Subir datos-*/
btnSubirDatos.addEventListener('click',()=>{

    let nombre = nombreCamp.value;
    let rol = nombreRol.value;
    let muertes = cantMuertes.value;
    let asesinatos = cantAsesinatos.value;
    let asistencias = cantAsistencias.value;
    const partida = new Partida(nombre,rol,asesinatos,muertes,asistencias);
    partidas.push(partida);
    //guardo datos
        guardarDatosChamp(partida, localStorage);
        //ejecuto el mostrarinfochamp
        mostrarInfoChamp();
        Swal.fire(
            'Archivos subidos!',
            'Los datos se subieron correctamente.',
            'success'
          )

          form.reset();
})

/*borrar datos*/
const btnBorrarDatos = document.getElementById('botonBorrarDatos');

btnBorrarDatos.addEventListener('click',()=>{
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Al eliminar vas a borrar el dato de la tabla!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText:'Cancelar',
        confirmButtonText: 'Si, borrar'
      }).then((result) => {
        if (result.isConfirmed) {
            contenedorTabla.removeChild(contenedorTabla.lastElementChild);
    let callPartidaArray = JSON.parse(localStorage.getItem("partida"));
    console.log(...callPartidaArray);
    callPartidaArray.splice(-1,1);
    console.log(callPartidaArray);
    let borrarPartidaArray = JSON.stringify(callPartidaArray);
        localStorage.setItem('partida', borrarPartidaArray);
          Swal.fire(
            'Borrado!',
            'Tu dato a sido borrado!',
            'success'
            
          )
        }
      })
    
})



/*Calculo para KDA */
const ka = partidas.map((el)=>{
    return{asesinatos:el.asesinatos,asistencias:el.asistencias}
});


const sumK = ka.reduce((ac,num)=>{return ac+=num.asesinatos},0);
const sumA = ka.reduce((ac,num)=>{return ac+=num.asistencias},0);

/*-----------------------------sacar-muertes---------------------*/
const d = partidas.map((el)=>{
    return{muertes:el.muertes}
});
const sumD = d.reduce((ac,num)=>{return ac+=num.muertes},0);



/*-----------------sacar KDA-------------------*/
function kda(k,d,a){
     return (a+k)/d;
}

let resultad = kda(sumK,sumD,sumA);

/*--Poner KDA en tabla--- */
const tablaKDA = document.getElementById('cuerpoTablaSegunda'),
inputVictorias = document.getElementById('victorias'),
inputDerrotas = document.getElementById('derrotas'),
botonFormKDA = document.getElementById('botonSubirDatosKDA');

let filaKDA = document.createElement('tr');
filaKDA.innerHTML = `<td>${resultad}</td>`;
tablaKDA.append(filaKDA);
/*------------Porcentaje de victoria------------*/
function porcentaje(vic,der){
    return (vic*100)/(vic+der)
    }
function animar(){
    botonFormKDA.classList.toggle("d-none");
}
botonFormKDA.addEventListener('click',()=>{
    let victoria = parseInt(inputVictorias.value);
    let derrota = parseInt(inputDerrotas.value);
    filaKDA.innerHTML +=  `<td>${victoria}</td><td>${derrota}</td>`;
    tablaKDA.append(filaKDA);
    let cuentaPorcentaje = porcentaje(victoria,derrota);
    let redondeo = Math.ceil(cuentaPorcentaje)
    filaKDA.innerHTML += `<td>${redondeo}%</td>`;
    tablaKDA.append(filaKDA);
    Swal.fire(
        'Archivos subidos!',
        'Los datos se subieron correctamente.',
        'success'
      );
      form.reset();
      animar();
})



/*-----Datos de usuarios------- */
const usuarios = [{
    nombre: 'Conra',
    mail: 'coach_conra@gmail.com',
    pass: 'admin123'
},
{
    nombre: 'lelox',
    mail: 'lelox@gmail.com',
    pass: 'user123'
},
{
    nombre: 'skipe',
    mail: 'skipe@gmail.com',
    pass: 'user1234'
}]



/*------Const declaradas para usarlas en el proyecto----------- */
const mailLogin = document.getElementById('emailLogin'),
    passLogin = document.getElementById('passwordLogin'),
    recordar = document.getElementById('recordarme'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    nombreUsuario = document.getElementById('nombreUsuario'),
    modal = new bootstrap.Modal(modalEl),
    contModalTable = document.getElementById('contModalTable'),
    contModalTable2 = document.getElementById('contModalTable2'),
    toggles = document.querySelectorAll('.toggles');

    /*--------------Guardar datos  storage----- */
function guardarDatos(usuarioDB, storage) {
    const usuario = {
        'name': usuarioDB.nombre,
        'user': usuarioDB.mail,
        'pass': usuarioDB.pass
    }

    storage.setItem('usuario', JSON.stringify(usuario));
    }
/*----------borrar datos del local y session storage------------- */
function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}
/*------Recuperar los datos de lusuario en el storage----- */
function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}

/*-------Saludar al usuario mediante el Dom------ */
function saludar(usuario) {
    nombreUsuario.innerHTML = `<span class="color__default--span">Bienvenido/a,</span> <span class="user__style">${usuario.name}</span>`
}

/*----Funcion para cambiar la clase del index y mostrar o no lo que se quiera-----*/
function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

/*------chequea si el usuario ta logeado, no mostrar el login y lo demas del index que use la clase 'd-none'--------------------- */
function estaLogueado(usuario) {
    let partidaEnStorage = JSON.parse(localStorage.getItem('partida'));
    if (usuario) {
        saludar(usuario);
            getDataJson();
            
        presentarInfo(toggles, 'd-none');

    }

    
}

/*-----Funcion para fijarse que los datos que se pasan sean iguales a lo guardado---- */
function validarUsuario(usersDB, user, pass) {
    let encontrado = usersDB.find((userDB) => userDB.mail == user);

    //console.log('Usuario encontrado por validate '+ typeof isFound);
    if (typeof encontrado === 'undefined') {
        return false; 
    } else {
        //si estoy en este punto, quiere decir que el mail existe, sólo queda comparar la contraseña
        if (encontrado.pass != pass) {
            return false;
        } else {
            return encontrado;
        }
    }
}

/*-----Boton de login/validación de login/en caso de validar guardar en el local o sesion/cerrar el modal/cambiar estado de clase para mostrar lo que se quiera mostrar--------- */
btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    //Validamos que ambos campos estén completos
    if (!mailLogin.value || !passLogin.value) {
        alert('Todos los campos son requeridos');
    } else {
        //Revisamos si el return de la función validate es un objeto o un boolean. Si es un objeto, fue una validación exitosa y usamos los datos. Si no, informamos por alert.
        let data = validarUsuario(usuarios, mailLogin.value, passLogin.value);

        if (!data) {
            alert(`Usuario y/o contraseña erróneos`);
        } else {

            //Revisamos si elige persistir la info aunque se cierre el navegador o no
            if (recordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarUsuario(localStorage));
            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarUsuario(sessionStorage));
            }
            //Recién ahora cierro el cuadrito de login
            modal.hide();
            //Muestro la info para usuarios logueados
            presentarInfo(toggles, 'd-none');
        }
    }
});

/*-------Boton de cerrar sesion/borrar datos de storage---------- */
btnLogout.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(toggles, 'd-none');
});

estaLogueado(recuperarUsuario(localStorage));