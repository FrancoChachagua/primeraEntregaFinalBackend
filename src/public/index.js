const socket = io();
// PUT
const $paramsId = document.querySelector('#paramsId');
const $divUpdate = document.querySelector('#divUpdate');
const $formUpdate = document.querySelector('#formUpdate');
const $formPostN = document.querySelector('#formPostN')
// POST
const $divAddProductos = document.querySelector('#divAddProductos');
const $divPost = document.querySelector('#divPost');
const $formPost = document.querySelector('#formPost');
const $btnGetAll = document.querySelector('#showAllProducts');
// GET
const $insertTableDCart = document.querySelector('#insertTableDCart')
const $divTableCart = document.querySelector('#divTableCart')
// 
const $fetchTxt = document.querySelector('#fetchTxt');
const productosURL = '../files/productos.txt';
const carritoURL = '../files/carrito.txt';
const $realTimeCards = document.getElementById('realTimeCards');

socket.on('realTimeCards', ()=>{
    getCards(productosURL)
})

function getCards(url) {
    fetch(url)
        .then(response => response.text())
        .then(data=>JSON.parse(data))
        .then(response =>{
            const mapCardsDos = response.map(prod => `<div class="d-inline-flex m-2">
                                                        <div class="card" id="${prod.id}" key=${prod.id}>
                                                            <div class="card-header"> 
                                                                <p class="text-center">  ${prod.nombre}  </p>
                                                            </div>
                                                            <div class="card-body">
                                                                <img src="${prod.foto}" alt="${prod.nombre}" width="300px" height="300px" >
                                                                <p class="text-center"> $${prod.precio}</p>
                                                            </div>
                                                            <div class="card-footer text-center">
                                                                <button class="btn btn-primary buttonAddToCart "
                                                                onclick="addProductToCartForId(${prod.id})"
                                                                >Comprar</button>
                                                                <span>
                                                                    <button type="button" id="btnEdit" class="btn btn-primary ml-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop" 
                                                                    onclick="editProductForId(${prod.id})">
                                                                        <i class="fas fa-edit"></i>
                                                                    </button>
                                                                </span>

                                                                <span>
                                                                    <button id="btnEdit" class="btn btn-primary ml-1" 
                                                                    onclick="deleteProductForId(${prod.id})">
                                                                        <i class="fas fa-trash-alt"></i>
                                                                    </button>
                                                                </span>
                                                                
                                                            </div>
                                                        </div>                                            
                                                    </div>
                                                `)
            $fetchTxt.innerHTML = mapCardsDos;              
    })
}


// PUT (edit product)

function editProductForId(prod_id) {
    let id = prod_id
    $paramsId.value = id;
    return console.log(id);
}

$divUpdate.addEventListener('submit',(e)=>{
    e.preventDefault();
    let formData = new FormData($formUpdate);
    let paramsId = formData.get('paramsId');
    let nombre = formData.get('modalTitle');
    let precio = formData.get('modalPrice');
    precio = parseInt(precio);
    paramsId = parseInt(paramsId)
    let descripcion = formData.get('modalDescripcion');
    let stock = formData.get('modalStock');
    let foto = formData.get('modalImagen');

    fetch(`http://localhost:8080/api/productos/${paramsId}`,{
        method:'PUT',
        body:JSON.stringify({
            id:paramsId,
            nombre:nombre,
            precio:precio,
            descripcion:descripcion,
            stock:stock,
            foto:foto
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(alert(`Usted ha modificado el producto ${paramsId}`))
    .then(res => res.json())
    .then(res=> {
        console.log(res);
        socket.on('realTimeCards', getCards(productosURL))
    });
})

// DELETE (product)

function deleteProductForId(prod_id) {
    let paramsId = prod_id;
    fetch(`http://localhost:8080/api/productos/${paramsId}`, {
        method: 'DELETE',
    })
    .then(alert(`Usted ha BORRADO el producto ${paramsId}`))
    .then(res => res.json())
    .then(res=> {
        console.log(res);
        socket.on('realTimeCards', getCards(productosURL))
    });
}


// POST (add product)

$divPost.addEventListener('submit',(e)=>{
    e.preventDefault();
    let formData = new FormData($formPostN);
    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    let nombre = formData.get('modalTitle');
    let precio = formData.get('modalPrice');
    let descripcion = formData.get('modalDescripcion');
    let stock = formData.get('modalStock');
    let foto = formData.get('modalImagen');

    fetch('http://localhost:8080/api/productos',{
        method:'POST',
        body:JSON.stringify({
            nombre:nombre,
            precio:precio,
            descripcion:descripcion,
            stock:stock,
            foto:foto
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(alert(`Usted ha añadido un nuevo producto!`))
    .then(result =>{
        return result.json();
    }).then(json=>{
        console.log(json);
        socket.on('realTimeCards', getCards(productosURL))
    })
})

//POST (buy product)

function addProductToCartForId(prod_id) {
    let paramsId = prod_id;
    fetch(`http://localhost:8080/api/carrito/${paramsId}/productos`, {
        method: 'POST',
    })
    .then(alert(`Usted ha añadido el producto ${paramsId} al carrito`))
    .then(res => res.json())
    .then(res=> {
        console.log(res);
        socket.on('realTimeCards', getCards(productosURL));
    });
}

// GET (all cart)
fetch(carritoURL)
    .then(response => response.text())
    .then(data=>JSON.parse(data))
    .then(response =>{
        let idCart = response[0].id;
        let timestampCart = response[0].timestamp;
        let lastCart = response[0].producto;

        const lastCartInformation = `<b> <span class="text-primary">Id carrito: ${idCart} </span> --- <span class="ml-4">Hora de creacion${timestampCart}</span> </b>` ;
        $insertTableDCart.innerHTML += lastCartInformation;  
        
        // No duplicados
        let cartMap = lastCart.map(item=>{
            return [item.id,item]
        });
        let cartMapArray = new Map(cartMap); 
        let lastCartNoDuplicates = [...cartMapArray.values()];
        
        const mapTableCart = lastCartNoDuplicates.map(prod => `<tr class="bg-dark"> 
                                                        <th scope="row"></th>
                                                        <td>${prod.nombre}</td>
                                                        <td>$${prod.precio}</td>
                                                        <td><img class="rounded" width="70" height="50" src=${prod.foto} alt=${prod.nombre}></td>
                                                    </tr>
                                                `)
        $divTableCart.innerHTML += mapTableCart;              
})