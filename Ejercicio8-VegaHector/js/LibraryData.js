
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

// -----------------------------------------------------------------------------------------

// Para la carga de listas  e INICIALIZACION DE LAS TABLAS 
// Variables para saber como se enuentra la tabla 
let dataTable;
let dataTableIsInitialized = false;

// Opnciones escitas al la tabla 
const dataTableOptions = {
    // scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20], // cantidad de resgistros pr pagina
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3,4] },
        { orderable: false, targets: [0,2] },
        { searchable: false, targets: [2,3] }
        //{ width: "50%", targets: [0] }
    ],
    // pageLength: 3,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await listProducts();

    dataTable = $("#dataTable_ListasProductos").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};

const listProducts = async () => {
    try {
        const response = await retornaUsuarioActual();
        const productos = await response.taskList;
        const categorias = await response.categorias
        console.log(productos);
        console.log(categorias);

        let selecCategorias = `<option value="">Seleccionar...</option>`;
        let content = ``;
        productos.forEach((producto, index) => {
            content += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>${producto.categoria}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.estado}</td>
                    <td class="center">
                        <button class="btn btn-sm btn-primary btn-edit"><i class="fa-solid fa-pencil"></i>Edit</button>
                    </td>
                </tr>`;
        });

        categorias.forEach( (categoria) => {

            selecCategorias +=`
            <option value="${categoria}">${categoria}</option>
            `
            
        })
        tableBody_ListasProductos.innerHTML = content;
        selectCategoria.innerHTML = selecCategorias;
    } catch (ex) {
        alert(ex);
    }
};

window.addEventListener("load", async () => {
    await initDataTable();
});


// ---------------------------------------------------------------------------------------------------
// CAMBIAR EN EL FORMULARIO SEGUN SELECIONE ALGO
// lista las categorias existentes 
document.getElementById('selectCategoria').addEventListener('change', function() {
    // Obtiene el valor seleccionado
    var selectedValue = this.value;

    // Actualiza al valor de la selecion 
    document.getElementById('categoria_Producto').value = selectedValue;
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// -----------CONSTANTES BOTONES DEL APARTADO DE Formulario de DATa-----------
// para saber si existe o no el boton 
let btnCrearIsDelete=false; 
let indiceFilaaEditar = -1

// Boton que crea una nueva producto
const btnCreateProduct = document.getElementById("BTN_crearProducto")
const btnCleanForm = document.getElementById("BTN_limpiarFormulario")
const btnModificarProduct = document.getElementById("BTN_modificarProducto")
const btnElimarProducto = document.getElementById("BTN_eliminarProducto")



// APARTADO DE EVENTOS POR BOTONES ------------------------------------------------------------



// Boton de Limpiar Formulario 

btnCleanForm.addEventListener("click" , () => {
    // Limpiar el formulario
    document.getElementById("form_Product").reset();
})


// boton para crear un producto 


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

                await initDataTable(); 
            
} catch (error) {
    alert(error)
}

})
// --------------------- BOTON DE EDITAR EN LAS FILAS DE LA TABLA -------------------------------


// PARA LOS BOTONES DE ESITAR EN LA TABLA
// esta funcion esta pendiente de todo el documento y espera un evento 
// verifica si el evento es un click en una targeta que tenga la clase de bnt-edit 
document.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("btn-edit")) {
        // Obtener los datos segun la row en la que se preciono el click
        const row = e.target.closest("tr");
        // asignando valores a las constantes 
        const nombre = row.cells[0].textContent;
        const categoria = row.cells[1].textContent;
        const cantidad = row.cells[2].textContent;
        const estado = row.cells[3].textContent;
        indiceFilaaEditar = indiceProductoAEditar(row)
        // llenando el formulario con los datos de la fila de la tabla
        document.getElementById("nombre_Producto").value = nombre;
        document.getElementById("categoria_Producto").value = categoria;
        document.getElementById("cantidad_Producto").value = cantidad;
        document.getElementById("estado_Producto").value = estado;

        // Ocultando los botones de crear y mostrar los de editar y eliminar 
        document.getElementById("BTN_crearProducto").remove();
        btnCrearIsDelete=true
        document.getElementById("BTN_limpiarFormulario").addEventListener("click" , () => {
            // Limpiar el formulario
            document.getElementById("form_Product").reset();
            indiceFilaaEditar =-1
            // Función para crear el btn crear 
            
            verificarBotonCrear()

               
            
        })
        document.getElementById("BTN_modificarProducto").style.display = "inline-block";
        document.getElementById("BTN_eliminarProducto").style.display = "inline-block";
    }
});



// --------------BOTON DE MODIFICAR REGISTRO ------------------
btnModificarProduct.addEventListener("click", async () => {
    try {
        // Obtener los datos del formulario
        const nombreProducto = document.getElementById("nombre_Producto").value;
        const categoriaProducto = document.getElementById("categoria_Producto").value;
        const cantidadProducto = document.getElementById("cantidad_Producto").value;
        const estadoProducto = document.getElementById("estado_Producto").value;

        // Validar que no se encuentren datos vacios
        if (!validarCampos(nombreProducto) || !validarCampos(categoriaProducto) || !validarCampos(cantidadProducto) || !validarCampos(estadoProducto)) {
            alert("Alguno de los campos se encuentra vacío");
            return;
        }



        // obtener el indice del producto que se quiere modificar 
        const indiceProducto = indiceFilaaEditar;
        if (indiceProducto === -1) {
            alert("No se seleciono un producto o el producto es inexistente");
            return;
        }

       // obtencion de los datos 
        const infoUser = retornaUsuarioActual();
        const listaProductos = infoUser.taskList;

        // actualizando los datos segun el indice que es el producto
        listaProductos[indiceProducto].nombre = nombreProducto;
        listaProductos[indiceProducto].categoria = categoriaProducto;
        listaProductos[indiceProducto].cantidad = cantidadProducto;
        listaProductos[indiceProducto].estado = estadoProducto;


        if (!infoUser.categorias.includes(categoriaProducto)) {
            // La categoria no existe
                // CRAER UNA NUEVA CATEGORIA 
    
                infoUser.categorias.push(categoriaProducto)
                alert(`Se creao una nueva categoria: ${categoriaProducto}`);

            }

        // actualizando la losta completa con los cambios del usuario 
        infoUser.taskList = listaProductos;

        //actualizando todo del local store
        const usuarios = JSON.parse(localStorage.getItem("usuarios"));
        // encontrando el indice del usuario 
        const indiceUsuario = usuarios.findIndex(user => user.fullName === infoUser.fullName);

        // actualizando las listas de productos y demas del usuario
        usuarios[indiceUsuario] = infoUser;

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        eliminarCategoriasSinProductosExistentes()

        // Limpiar el formulario
        document.getElementById("form_Product").reset();
        verificarBotonCrear()

        // se completo la accion
        alert("El Producto se modifico correctamente");

        // Actualizar la tabla
        await initDataTable();
    } catch (error) {
        alert(error);
    }
});



btnElimarProducto.addEventListener("click" , async() =>{

try {

         // obtener el indice del producto que se quiere modificar 
         const indiceProducto = indiceFilaaEditar;
         if (indiceProducto === -1) {
             alert("No se seleciono un producto o el producto es inexistente");
             return;
         }
 
        // obtencion de los datos 
         const infoUser = retornaUsuarioActual();
         const listaProductos = infoUser.taskList;

         // eliminar el producto 
        const nuevosProductos = [];
        for (let i = 0; i < listaProductos.length; i++) {
            if (i !== indiceProducto) {
                nuevosProductos.push(listaProductos[i]);
            }
        }

        // Actualizar la lista de productos en el usuario
        infoUser.taskList = nuevosProductos;

         //actualizando todo del local store
         const usuarios = JSON.parse(localStorage.getItem("usuarios"));
         // encontrando el indice del usuario 
         const indiceUsuario = usuarios.findIndex(user => user.fullName === infoUser.fullName);
 
         // actualizando las listas de productos y demas del usuario
         usuarios[indiceUsuario] = infoUser;
 
         localStorage.setItem("usuarios", JSON.stringify(usuarios));
         eliminarCategoriasSinProductosExistentes()
         // Limpiar el formulario
         document.getElementById("form_Product").reset();
         verificarBotonCrear()
 
         // se completo la accion
         alert("El Producto se Elimino correctamente");
 
         // Actualizar la tabla
         await initDataTable();
} catch (error) {
    alert(error)
}

} )

// FUNCIONES ----------------- 


// Funcion que valida que no se encuentren datos Vacios
function validarCampos(campo){

    if ( campo.trim()== '' ) {
       return false
    }
    return true
    }

function indiceProductoAEditar(fila) {
    const index = fila.rowIndex - 1; 
    return index;
}

// funcion que elimina las categorias vacias
// extrae las categorias del usuario 
// segun las categorias hace un for que recotrre todos los prodyuctros y si algun producto tiene la actegorias
// lo almacena en un array temporal que luego de terminar de iterar todas las categorias 
// actualiza las categorias del usuario 
function eliminarCategoriasSinProductosExistentes() {
    // Obtener al usuario 
    const infoUser = retornaUsuarioActual();

    // LISTAS DE CATEGORIAS Y PRODUCTOS EXISTENTES
    const categoriasDelUsuario = infoUser.categorias;
    const listaProductos = infoUser.taskList;
    // console.log(listProducts);
    // nueva lista
    const nuevalistaCategorias = []

    // para todas las categorias has 
    for (const categoria of categoriasDelUsuario) {


        // para ver si tiene almenos un producto
        const categoriaTieneProducto = listaProductos.some(producto => producto.categoria === categoria)
        if (categoriaTieneProducto) {
            nuevalistaCategorias.push(categoria)
            // console.log(categoria , nuevalistaCategorias);
        }
    }

    // actualizando la loista de categorias 
    infoUser.categorias = nuevalistaCategorias;

    // actualizando el local store
    const usuarios = JSON.parse(localStorage.getItem("usuarios"))

    const indiceUsuario = usuarios.findIndex(user => user.fullName === infoUser.fullName)
    // console.log(indiceUsuario);
    usuarios[indiceUsuario] = infoUser;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}


function verificarBotonCrear() {
    if (btnCrearIsDelete) {
        const newButton = document.createElement("button"); 
        newButton.setAttribute("type", "button"); 
        newButton.setAttribute("id", "BTN_crearProducto"); 
        newButton.classList.add("btn", "btn-primary", "d-inline-block", "mx-5", "mb-4"); 
        newButton.innerHTML = '<i class="bi bi-plus-circle"></i> Crear'; 
        const divContenedor = document.querySelector('.col-md.text-center');
        const segundoElemento = divContenedor.children[1];
        divContenedor.insertBefore(newButton, segundoElemento);
        document.getElementById("BTN_modificarProducto").style.display = "none";
        document.getElementById("BTN_eliminarProducto").style.display = "none";
        btnCrearIsDelete=false
    }
}