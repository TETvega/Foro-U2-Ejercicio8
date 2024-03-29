
// Obtener el nombre de usuario de la URL
const parametros = new URLSearchParams(window.location.search);
const nombreUsuario = parametros.get('usuario');
console.log(nombreUsuario);

// para mandar el usuario al texto 
document.getElementById('nombre-usuario').textContent = nombreUsuario;

// funcion que retorna toda la informacion del usuario actual
function retornaUsuarioActual() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    
    // encuentra el usuario activo en la pagina
    const usuarioEncontrado = usuarios.find( (usuario) => usuario.fullName === nombreUsuario);
     // console.log(usuario.fullName)
    // console.log(usuarioEncontrado);
    return usuarioEncontrado;
}


// Para la carga de listas 

// ------------------------------------------------ 

const listTask = async() => {

    try {
        // variable que tiene toda la informacion del usuarios actual
        const infoUser = retornaUsuarioActual();
        const lista = await infoUser.taskList
        console.log(lista);

        let contenido =  ''

        // itera sobre la cantidad de objetos que existen 
        lista.forEach( (producto, index) => {
            // contendio de la tabla
            contenido += 
            `<tr>
                <td> ${index + 1}</td>
                <td> ${producto.nombre}</td>
                <td> ${producto.categoria}</td>
                <td> ${producto.cantidad}</td>
                <td> ${producto.estado}</td>
            </tr>`;
        });
        // Insertar el contenido en la tabla
        document.getElementById("DataTableBody_ListasProductos").innerHTML = contenido;

    } catch (error) {
        alert(error)
    }

}
// para cargar el contenido preexistente en la data del usuario 
window.addEventListener("load" , async() => {
    await listTask()
})



// CAMBIAR EN EL FORMULARIO SEGUN SELECIONE ALGO

document.getElementById('selectCategoria').addEventListener('change', function() {
    // Obtiene el valor seleccionado
    var selectedValue = this.value;

    // Actualiza al valor de la selecion 
    document.getElementById('categoria_Producto').value = selectedValue;
});



// -----------CONSTANTES BOTONES DEL APARTADO DE Formulario de DATa-----------

// Boton que crea una nueva producto
const btnCreateProduct = document.getElementById("BTN_crearProducto")




// APARTADO DE EVENTOS POR BOTONES ------------------------------------------------------------

btnCreateProduct.addEventListener("click" , async() => {
//form_Product

try {
    
       // datos del formulario Crear Producto
        const nombreProducto = document.getElementById("nombre_Producto").value;
        const categoriaProducto = document.getElementById("categoria_Producto").value;
        const cantidadProducto = document.getElementById("cantidad_Producto").value;
        const estadoProducto = document.getElementById("estado_Producto").value;
        
            // validar que no se ingresen datos vacios 
        if(!validarCampos(nombreProducto) || !validarCampos(categoriaProducto)|| !validarCampos(cantidadProducto) || !validarCampos(estadoProducto)){
            alert("Alguno de los campos se encuentr vacio")
            return
        }
        
            const infoUser = retornaUsuarioActual();
            const listaProductos = infoUser.taskList
            // console.log(infoUser.taskList);
            // console.log(infoUser);
            // console.log(listaProductos);
                // valor de la categoria
        
        
        
                // Validar si la categoraa ingresada ya existe
                if (!infoUser.categorias.includes(categoriaProducto)) {
                // La categoria no existe
                    // CRAER UNA NUEVA CATEGORIA 
        
                    infoUser.categorias.push(categoriaProducto)
                    alert(`Se creao una nueva categoria: ${categoriaProducto}`);
                
                }
        
                const newProducto = {
                    nombre: nombreProducto,
                    categoria: categoriaProducto,
                    cantidad : cantidadProducto,
                    estado: estadoProducto
                }
                
                // agrega el nuevo producto 
                listaProductos.push(newProducto);
                
                // console.log(infoUser);
                // console.log(infoUser.fullName);
                const usuarios = JSON.parse(localStorage.getItem("usuarios"));
                const indiceUsuario = usuarios.findIndex(user => user.fullName === infoUser.fullName);
        
                // actualizar categorias y productos 
                console.log(infoUser);
                console.log(indiceUsuario);
                console.log(usuarios);
                console.log(listaProductos);
                usuarios[indiceUsuario].categorias = infoUser.categorias;
                usuarios[indiceUsuario].taskList = listaProductos;
        
                // Guardar los datos actualizados
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
        
                // Limpiar el formulario
                document.getElementById("form_Product").reset();
        
                // mensaje de correcto
                alert("Se ha agregado un nuevo producto correctamente");

                await listTask(); 
            
} catch (error) {
    alert(error)
}

})



// FUNCIONES ----------------- 


// Funcion que valida que no se encuentren datos Vacios
function validarCampos(campo){

    if ( campo.trim()== '' ) {
       return false
    }
    return true
    }