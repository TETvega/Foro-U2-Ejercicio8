
// obtencion de datos si no crea el arreglo vacio
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || localStorage.setItem("usuarios", JSON.stringify([

    // creacion del usuario SUDO 
    {
      fullName: 'SUDO',
      email: 'SUDO',
      password: '123'
    }
  ]));

// -----------CONSTANTES BOTONES DEL APARTADO DE LOGIN.HTML-----------

// Boton que redirige a la creacion de la cuenta
const btnGoToCreateAccount = document.getElementById("btnGoToCreateAccount")

// Boton de Login , este oculta el formulario de Registro y muestra el form de incio de secion
const btnGoToLogin =   document.getElementById("btnGoToLogin")

// Boton para crear una cuenta
const btnCreateAccount = document.getElementById("BtnCreateAccount");
// boton para iniciar sesion 
const btnLogin = document.getElementById("btnLogin");



// APARTADO DE EVENTOS POR BOTONES ------------------------------------------------------------

// Lo lleva al apartado de crear cuenta
btnGoToCreateAccount.addEventListener("click", goToCreateAccount ) 


// Lo lleva a la parte de Iniciar sesion
btnGoToLogin.addEventListener("click", goToLoginForm) 





// CONSTANTES DE FORMS ----------------------------------

const formCreateAccount = document.getElementById("createAccountForm");
const formLogin = document.getElementById("loginForm");




// ---------------- BOTON INICIAR SESION --------------

btnLogin.addEventListener("click" , function(){

   // datos del formulario Login
   const usuario = document.getElementById("email-login").value;
   const password = document.getElementById("password-login").value;

    // validar que no se ingresen datos vacios 
  if(!validarCampos(usuario) || !validarCampos(password)){
    alert("Alguno de los campos se encuentr vacio")
    return
  }

   
  //  Valida inicio como SUDO
    if (  usuario === 'SUDO' && password === '123') {
      alert("Se Inicio Sesion Correctamente SUPER ADMIN");
      window.location.href = "SUDO.html"
      

    }else{
    // recupera el local store
    const usuarios = JSON.parse(localStorage.getItem("usuarios"));

    // Verifica si existe el usuario
    const UserExiste = usuarios.find( user => 

    user.email === usuario &&
    user.password === password
    );
    
    console.log(UserExiste);

    if (UserExiste) {
       // Sesion Abierta
       alert("Se Inicio Sesion Correctamente");
       const nombreUsuario = UserExiste.fullName;

       // Redirigir al usuario a la pagina segun el fullname 
       window.location.href = "DataShow.html?usuario=" + encodeURIComponent(nombreUsuario);
    } else {
      // Sesion negada
      alert("Usuario o Contraseña incorrecto");

    }} 

    formLogin.reset()
})



// ------------ BOTON CREAR CUENTA ------------------
btnCreateAccount.addEventListener("click", function() {
  
  // Obtencion de datos del Formulario CreateAccount
  const nombreCompleto = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const ConfirmarPassword = document.getElementById("confirmPassword").value;

    // llamada a la funcion para validar que no se ingresraon algun campo vacio
    if (!validarCampos(nombreCompleto) || !validarCampos(email) || !validarCampos(password) || !validarCampos(ConfirmarPassword) ) {
        alert(" Alguno de los campos se encuentra Vacio")
        return
    }

  // console.log(email,nombreCompleto , password, ConfirmarPassword);
  // Verificar si las contraseñas son iguales
  if (password != ConfirmarPassword) {
    alert("Las contraseñas no son iguales");
    return;
  }

//  los datos para veriicar por el email si existe o no 
const emailsExistentes = usuarios.map( user => user.email)
// console.log(emailsExistentes);
if(emailsExistentes.includes(email)){
  alert("El correo esta en uso");
  return;
}

//Creacion del nuevo usuario
const newUsuario = {
  fullName: nombreCompleto,
  email: email,
  password: password,
  taskList: [],
};

// Apush del nuevo usuarios
usuarios.push(newUsuario);

// Guada o actualiza la lista de los usuarios
localStorage.setItem("usuarios", JSON.stringify(usuarios));


alert("La cuenta se creo correctamente");
formCreateAccount.reset();
});



// ------------------  APARTADO DE FUNCIONES ---------------------





// --------- FUNCIONES --------------


function goToCreateAccount() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("createAccountForm").style.display = "block";
    // elimiar el elemento por completo para que n estorbe y no desborde la pag
    document.getElementById("textExplain").remove();
    document.getElementById("DivIzquierdo").classList.remove("col-lg-6")
    document.getElementById("DivIzquierdo").classList.add("col-lg-12")
    document.getElementById("DivBtnLogin").classList.add('col-lg-6')
    document.getElementById("DivBtnCreateAccount").classList.add("col-lg-6")
    formLogin.reset();
}

function goToLoginForm() {
    

    document.getElementById("loginForm").style.display = "block";
    document.getElementById("createAccountForm").style.display = "none";
    document.getElementById("DivIzquierdo").classList.remove("col-lg-12")
    document.getElementById("DivIzquierdo").classList.add("col-lg-6")
    // document.getElementById("DivBtnLogin").classList.remove("col-lg-6")
    // Creacion total del div ELIMINADO 
    const newDiv = document.createElement("div");
    newDiv.id = "textExplain";
    newDiv.className = "col-lg-6 d-flex align-items-center gradient-custom-2";
    // Crear el div tal cual existe
    newDiv.innerHTML = `
    <div class="text-white px-3 py-4 p-md-5 mx-md-4">
        <h4 class="mb-4">Nosotros Somos Mas que Una Tienda</h4>
        <p class="small mb-0">Somos tu app favorita de almacenaje, se te olvido tus quehaceres. La tiendita te los recuerda en cualquier dia
            Disfruta siempre junto a Nosotros
        </p>
    </div>`
    document.getElementById("hero").appendChild(newDiv);

    document.getElementById("DivBtnLogin").classList.remove('col-lg-6')
    document.getElementById("DivBtnCreateAccount").classList.remove("col-lg-6")
    formCreateAccount.reset();
  }


// Funcion que valida que no se encuentren datos Vacios
  function validarCampos(campo){

    if ( campo.trim()== '' ) {
       return false
    }
    return true
    }

// function validarCamposLogin(usuario , password){
//     if ( usuario.trim()== '' || password.trim()== '') {
//       return false
//     }
//     return true
// }
    
    
    