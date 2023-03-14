const nombreUsuario = document.getElementById('nombreUsuario')
const btnIngreso = document.getElementById('btnIngreso')
const btnCerrar = document.getElementById('btnCerrar')
const formTexto = document.getElementById('formTexto')
const contenidoWeb= document.getElementById('contenidoWeb')
const formulario = document.getElementById('formulario')

console.log('--funcionando--')

firebase.auth().onAuthStateChanged((user) => {
    
    if (user) {
        var uid = user.uid
        accionCerrarS()
        nombreUsuario.innerHTML = user.displayName
        contenidoChat(user)
        contenidoWeb.innerHTML = ``
    }else{
        accionAcceder()
        nombreUsuario.innerHTML = `BCHAT`
        contenidoWeb.innerHTML = `
        
            <p class="lead mt-5 text-center">Debes iniciar sesión</p>

        `
    }
})

const contenidoChat = user => {

    formulario.addEventListener('submit',e =>{
        e.preventDefault()
        console.log(formTexto.value)
        if (!formTexto.value.trim()) {
            console.log('texto vacio')
            return
        }

        firebase.firestore().collection('chat').add({
            texto: formTexto.value,
            uid: user.uid,
            fecha: Date.now()
        }).then(res =>{
            console.log('Textoagregadp')
        })

        formTexto.value=''

    })

    firebase.firestore().collection("chat").orderBy('fecha')
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("chat: ", change.doc.data());

                if(user.uid === change.doc.data().uid){
                    contenidoWeb.innerHTML += `
                    <div class="text-end">
                     <span class="badge bg-info">${change.doc.data().texto}</span>
                    </div>
                    `
                }else {
                    contenidoWeb.innerHTML += `
                    
                    <div class="text-start">
                        <span class="badge bg-info">${change.doc.data().texto}</span>
                    </div>

                    `
                }


                contenidoWeb.scrollTo = contenidoWeb.scrollHeight


            }
            if (change.type === "modified") {
                console.log("Modified chat: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed chat: ", change.doc.data());
            }
        });
    });

}

const accionAcceder = () =>{
    console.log('usuario no registrado')
    formulario.classList.add('d-none')
    contenidoWeb.innerHTML = `
        <p class="lead mt-5 text-center">Debes iniciar sesión</p>
    
    `
    btnIngreso.addEventListener('click',async()=>{
        const provider = new firebase.auth.GoogleAuthProvider();
        
        try {
            
            await firebase.auth().signInWithPopup(provider)
                

        } catch (error) {
            console.log(error)
        }

    })
}

const accionCerrarS = ()=>{
    console.log('usuario registrado')
    formulario.classList.remove('d-none')
    btnCerrar.addEventListener('click',()=>{
        firebase.auth().signOut()
    })
}