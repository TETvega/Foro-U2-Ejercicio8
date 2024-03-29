
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



// Para la carga de listas  e INICIALIZACION DE LAS TABLAS 
// Variables para saber como se enuentra la tabla 
let dataTable;
let dataTableIsInitialized = false;

// Opnciones escitas al la tabla 
const dataTableOptions = {
    //scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20], // cantidad de resgistros pr pagina
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3] },
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
const btnCleanForm = document.getElementById("BTN_limpiarFormulario")



// APARTADO DE EVENTOS POR BOTONES ------------------------------------------------------------
let btnCrearIsDelete=false;
btnCleanForm.addEventListener("click" , () => {
    // Limpiar el formulario
    document.getElementById("form_Product").reset();
})

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
            // Función para crear el btn crear 
            
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
               
            
        })
        document.getElementById("BTN_modificarProducto").style.display = "inline-block";
        document.getElementById("BTN_eliminarProducto").style.display = "inline-block";
    }
});

// FUNCIONES ----------------- 


// Funcion que valida que no se encuentren datos Vacios
function validarCampos(campo){

    if ( campo.trim()== '' ) {
       return false
    }
    return true
    }