function retornaUsuarioActual() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));
    
    // encuentra el usuario activo en la pagina
    const usuarioEncontrado = usuarios.find( (usuario) => usuario.email === 'SUDO');

    return usuarioEncontrado;
}



// Para la carga de listas  e INICIALIZACION DE LAS TABLAS 
// Variables para saber como se enuentra la tabla 
let dataTable;
let dataTableIsInitialized = false;

// Opnciones escitas al la tabla 
const dataTableOptions = {
    // scrollX: "2000px",
    lengthMenu: [5, 10, 15, 20], // cantidad de resgistros pr pagina
    columnDefs: [
        { className: "centered", targets: [0, 1, 2] },
        { orderable: false, targets: [0,2] },
        { searchable: false, targets: [2] }
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

///////////////////////////// ------------------------ FILTRADO DE DATOS -------------------------------/////////////////////////////
// variable Global para Filtar
let filtroCategoria = ''
const initDataTable = async ( ) => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }

    await listProducts();

    dataTable = $("#dataTable_ListasUusarios").DataTable(dataTableOptions);

    dataTableIsInitialized = true;
};


///////////////////////////// ------------------------ Listar Productos existentes -------------------------------/////////////////////////////
const listProducts = async ( ) => {
    try {
        const sudo = await retornaUsuarioActual();
        const usuarios = await JSON.parse(localStorage.getItem("usuarios"));
        // console.log(productos);
        // console.log(categorias);

        let content = ``;
        usuarios.forEach((user) => {

            if (user.fullName !== "SUDO") {
                content += `
                <tr>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.password}</td>
                </tr>`;
            }

            
        });

        tableBody_ListasUusarios.innerHTML = content;



    } catch (ex) {
        alert(ex);
    }
};
///////////////////////////// ------------------------ cargar los productos al iniciar la pagina -------------------------------/////////////////////////////
window.addEventListener("load", async () => {
    await initDataTable();
});


// ---------------------------------------------------------------------------------------------------

