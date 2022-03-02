let carritoDeCompras = []
/* Contenedores */
const cdsContainer = document.querySelector(".main__disqueria__detalles__row");
const contenedorCarrito = document.getElementsByClassName('modal-body')[0];

/* Cosas del carrito */
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

/* Combos */
const comboEstilos=document.getElementById('estiloBusqueda');
const comboInterpretes=document.getElementById('interpreteBusqueda')


/* funcion para mostrar la lista de cds disponibles */
function mostrarListaCds(arrayCds){
    cdsContainer.innerHTML="";//limpio el html para que no quede nada
    /* ciclo para recorrer el array de cds disponibles */
    arrayCds.forEach(cd=>{
        let {nombre, imagen, interprete, estilo, precio, stock, id}=cd;//desestructurando el obj Cd
        let div = document.createElement('div');
        div.className = 'cd';
        div.classList.add('main__disqueria__detalles__col','col');
        div.innerHTML+=`<div class="card h-100" style="width: 20rem;">
                        <div class="card-header text-center">
                            ${nombre}
                        </div>
                        <img src="${imagen}" alt="${nombre}" class="card-img-top card__imagen">
                        <div class="card-body">
                            <h5 class="card-title text-center">${interprete}</h5>
                            <div class="card-text text-center">
                                <p>Estilo: <strong>${estilo}</strong></p>
                                <p>Precio: <strong>$${precio}</strong></p>
                                <p id="stock${id}">Stock: <strong>${stock}</strong></p>
                            </div>
                            
                        </div>
                        <div class="card-footer">
                            <button id="botonAgregar${id}" href="#" class="btn btn-primary" disabled>Comprar
                                <i class=" fa fa-shopping-cart" aria-hidden="true" e></i>
                            </button>
                            <input id="inputCantidad${id}" class="card__numero" type="number" value="1" min="1" max="${stock}" style="width:3rem">
                        </div>
                    </div>`;
        cdsContainer.appendChild(div);//agrego al contenedor

        //Verificar por acá si no hay stock deshabilitar el botón
        let botonAgregar = document.getElementById(`botonAgregar${id}`);
        
        botonAgregar.addEventListener('click',()=>{

            agregarAlCarrito(id);
        });
        stock!=0 && habilitarBoton(id);  
    });

}
/* fin funcion de mostrar lista de cds */


/* Funcion para habilitar botones **/
function habilitarBoton(id){
    document.getElementById(`botonAgregar${id}`).removeAttribute('disabled');//Ahora anda JODER!!!!
    
}
function deshabilitarBoton(id){
    document.getElementById(`botonAgregar${id}`).setAttribute('disabled',true);
    
}
/*funcion para buscar repetido en carrito */
function buscarRepetido(id){
    return carritoDeCompras.find(elemento=>elemento.id==id);
}



/* funcion para agregar al carrito */
function agregarAlCarrito(idCd) {
    let cdRepetido=buscarRepetido(idCd);

    
    if(cdRepetido){
        let {precio, stock, id}=cdRepetido;//desestructurando el obj Cd
        let inputCantidad=parseInt(document.getElementById(`inputCantidad${id}`).value);
        if (inputCantidad>0 && inputCantidad<=stock) {
            cdRepetido.cantidad+=inputCantidad;

            document.getElementById(`cantidad${id}`).innerHTML = `<td id="cantidad${id}">${cdRepetido.cantidad}</td>` 
            document.getElementById(`subtotal${id}`).innerHTML = `<td id="subtotal${id}">${cdRepetido.cantidad*precio}</td>`;
            actualizarCarritoDeCompras();  

            
            actualizarStock(cdRepetido,true,inputCantidad);//actualiza el stock en el array
            Toastify({
                text: "CD agregado al carrito",
                duration: 1500,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: false,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){} // Callback after click
            }).showToast();

            
        } else {
            
            Swal.fire({
                title: 'Error!',
                text: 'Cantidad de compra no válida o superior al stock. Favor de verificar la cantidad ingresada',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            
        }    
        document.getElementById(`inputCantidad${id}`).value=1;

        
    }else{
            let cdComprar = cds.find(elemento => elemento.id ==idCd);
            let { stock, id}=cdComprar;//desestructurando el obj Cd
            let inputCantidad=parseInt(document.getElementById(`inputCantidad${id}`).value);
            
            if (inputCantidad>0 && inputCantidad<=stock) {
                cdComprar.cantidad=inputCantidad;
                carritoDeCompras.push(cdComprar);
                actualizarCarritoDeCompras();
                agregarHtmlCarrito(cdComprar);
                actualizarStock(cdComprar,true,inputCantidad);//actualiza el stock en el array

                Toastify({
                    text: "CD agregado al carrito",
                    duration: 1500,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: false,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
                

            } else {
                
                    Swal.fire({
                        title: 'Error!',
                        text: 'Cantidad de compra no válida o superior al stock. Favor de verificar la cantidad ingresada',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
            }    
            document.getElementById(`inputCantidad${id}`).value=1;
    } 


}

/* fin funcion para agregar al carrito */

/*funcion para actualizar el stock de un producto */
function actualizarStock(cd,resta, cantidad){
    
    resta?cd.stock-=cantidad:cd.stock+=cantidad;
    
    document.getElementById(`stock${cd.id}`).innerHTML=`<p id="stock${cd.id}">Stock: <strong>${cd.stock}</strong></p>`;
    cd.stock==0 && deshabilitarBoton(cd.id);
};


/* funcion para agregar al html del carrito */
function agregarHtmlCarrito(cd){
    /*my new way */
    let {nombre, imagen, precio, id}=cd;//desestructurando el obj Cd
    let fila=document.createElement('tr');
    fila.id=`row${id}`;
    fila.innerHTML=`<td ><img src="${imagen}" alt="${nombre}" width="20%"/></td>
                    <td >${nombre}</td>
                    <td >${precio}</td>
                    <td id="cantidad${id}">${cd.cantidad}</td>
                    <td  id="subtotal${id}">${cd.cantidad*precio}</td>
                    <td ><button id="btnEliminar${id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button></td>`;
                    
    let filaMensaje=document.getElementById('celdaMensajeCarritoVacio')
    filaMensaje && quitarMensajeCarritoVacio(filaMensaje); //Quito el mensaje de carrito vacío
    detalleBody.appendChild(fila);
    
    
    let botonEliminar = document.getElementById(`btnEliminar${id}`);//obtengo el boton
    
    /* Agrego escucha del evento click al boton */
    botonEliminar.addEventListener('click',()=>{
        Swal.fire({
            title: 'Está seguro?',
            text: "No podrá deshacer el cambio!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText:'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borralo!'
        }).then((result) => {
            if (result.isConfirmed) {
                if(cd.cantidad == 1){
                    let contenedor=document.getElementById('detallesTbody');//ubico al contenedor padre
                    let row=document.getElementById(`row${id}`);//al hijo
                    contenedor.removeChild(row); //quito el hijo
                    actualizarStock(cd,false,1);//Actualizo el stock
                    carritoDeCompras = carritoDeCompras.filter(item => item.id != id);//actualizo el array carrito
        
                    carritoDeCompras.length==0 && noHayProductos()
                    
                }else{
                    cd.cantidad --;
                    actualizarStock(cd,false,1);//Actualizo el stock
                    document.getElementById(`cantidad${id}`).innerHTML = `<td id="cantidad${id}">${cd.cantidad}</td>`;
                    document.getElementById(`subtotal${id}`).innerHTML = `<td id="subtotal${id}">${cd.cantidad*precio}</td>`;
        
                
                }
                actualizarCarritoDeCompras();//
                localStorage.setItem('carrito', JSON.stringify(carritoDeCompras));

                Swal.fire(
                'Borrado!',
                'Producto quitado del carrito.',
                'success'
                )
            }
        })
        
    });
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}
/* fin funcion agregar al html del carrito */

/* function para recuperar el carrito de compras */
function recuperarCarrito(){
    let leerLocalStorage = JSON.parse(localStorage.getItem('carrito'))
    

    if(leerLocalStorage){
        leerLocalStorage.forEach(cd => {
        agregarAlCarrito(cd.id)
        });
    }
}

/* funcion para actualizar carrito */
function actualizarCarritoDeCompras(){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc,cd)=> acc +cd.cantidad , 0)
    precioTotal.innerText = carritoDeCompras.reduce((acc,cd)=> acc + (cd.precio * cd.cantidad), 0)
}
/* fin funcion para actualizar carrito */

/* funcion para obtener los distintos intérpretes */
function obtenerInterpretes(arrayCds){
    //Busco los nombres de los intérpretes únicamente
    console.log(arrayCds);
    let allInterpretes=[];
    allInterpretes=arrayCds.reduce((allInterpretes, claseCd)=>{
        allInterpretes.push(claseCd.interprete);
        return Array.from(new Set(allInterpretes));
    },[]);
    /* console.log(allInterpretes);
    let arrayPreFiltrado=[];
    arrayCds.forEach(element => {
        arrayPreFiltrado.push(element.interprete);
    });
    let arrayFiltrado=[];
    for (let index = 0; index < arrayPreFiltrado.length; index++) {
        const element = arrayPreFiltrado[index];
        if (arrayFiltrado.indexOf(element)==-1) {
            arrayFiltrado.push(element);    
        }
    
    } */
    return allInterpretes;
}

/* funcion para obtener los distintos intérpretes */
function obtenerEstilos(arrayCds){
    //Busco los nombres de los intérpretes únicamente
    let allEstilos=[];
    allEstilos=arrayCds.reduce((allEstilos,claseCd)=>{
        allEstilos.push(claseCd.estilo);
        return Array.from(new Set(allEstilos));
    },[]);
    /* let arrayPreFiltrado=[];
    arrayCds.forEach(element => {
        arrayPreFiltrado.push(element.estilo);
    });
    
    let arrayFiltrado=[];
    for (let index = 0; index < arrayPreFiltrado.length; index++) {
        const element = arrayPreFiltrado[index];
        if (arrayFiltrado.indexOf(element)==-1) {
            arrayFiltrado.push(element);    
        }
    
    } */
    return allEstilos;
}
function ObtenerInterprete(cd){
    return cd.interprete;
};
async function cargarArrayCds(){
    const URL='/js/datos.json';
    let array=[];
  /*   await fetch(URL).then(respuesta=>respuesta.json())
    .then(cds=>{
        cds.forEach(elemento=>array.push(elemento));
    });
    return array; */
    let respuesta=await fetch(URL);
    let datos=await respuesta.json();
    datos.forEach(elemento=>array.push(elemento));
    console.log(array);
    return array;
};

/* Comienzo */
let newCds=cargarArrayCds();
console.log(newCds);
llenarCombos(newCds); //Lleno los combos
mostrarListaCds(newCds); //Muestro los Cds
recuperarCarrito(); //Recupero el carrito del localStorage



