

// Obtener el nombre de usuario de la URL
const parametros = new URLSearchParams(window.location.search);
const nombreUsuario = parametros.get('usuario');

// para mandar el usuario al texto 
document.getElementById('nombre-usuario').textContent = nombreUsuario;