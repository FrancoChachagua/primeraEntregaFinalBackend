import fs from 'fs'
import makeId, { JSClock, makeRandomId, __dirname, deepCopyFunction } from '../utils.js';

const productosURL = __dirname+'/public/files/productos.txt';
const carritoDos = __dirname+'/public/files/carrito.txt';
let time = JSClock();
class Contenedor{
    async save(prod){
        try {
            let data = await fs.promises.readFile(productosURL,'utf-8')
            let productList = JSON.parse(data);
            let time = JSClock();
            if(productList.some(evt=>evt.nombre===prod.nombre)){
                return console.log("Ya has realizado este pedido");
            }else{
                let dataObj = {
                    id:makeId(productList),
                    timestamp:`${time.calendary} ${time.hour}`,
                    nombre: prod.nombre,
                    descripcion: prod.descripcion,
                    codigo: makeRandomId(5),
                    foto: prod.foto,
                    precio: prod.precio,
                    stock: prod.stock
                }
                productList.push(dataObj);
                try{
                    let thisId = `Id: ${dataObj.id}`
                    await fs.promises.writeFile(productosURL,JSON.stringify(productList,null,2));
                    return {message:"Pedido creado con exito", prod:dataObj}
                } catch(error) {
                    return {err: `No se pudo crear el pedido`}
                }
            }
        } catch {
            let time = JSClock();
            let dataObj = {
                id:1,
                timestamp: `${time.calendary} ${time.hour}`,
                nombre: prod.nombre,
                descripcion: prod.descripcion,
                codigo: makeRandomId(5),
                foto: prod.foto,
                precio: prod.precio,
                stock: prod.stock
            }
            try {
                let thisId = `Id: ${dataObj.id}`
                await fs.promises.writeFile(productosURL, JSON.stringify([dataObj], null, 2));
                return {message:"Pedido creado con exito", id:thisId }
            }catch(error){
                return console.log(`No se pudo crear el pedido !`);
            }
        }
    }
    async updateProduct(id,body){
        try{
            let data = await fs.promises.readFile(productosURL,'utf-8');
            let productList = JSON.parse(data);
            let time = JSClock();
            body.timestamp = `${time.calendary} ${time.hour}`;
            body.codigo = makeRandomId(5);   
            body.precio = parseInt(body.precio);
            // console.log(body);
            if(!productList.some(prd=>prd.id===id)) {
                return {error:'producto no encontrado'}
            }
            let result = productList.map(prod=>{
                if(prod.id===id){
                    body = Object.assign({id:id,...body})
                    return body;
                }else{
                    return prod;
                }
            })
            try{
                await fs.promises.writeFile(productosURL,JSON.stringify(result,null,2));
                return {message:"Producto actualizado"}
            }catch{
                return {message:"No se ha podido actualizar el producto"}
            }
        }catch(error){
            return {message:`Error: Hubo un problema al actualizar el producto ${error}`}
        }
    }
    async getById(id){
        try {
            let data = await fs.promises.readFile(productosURL, 'utf-8')
            let productList = JSON.parse(data);
            let object = productList.find(evt => evt.id === id);
            if (object) {
                return {object:object}
            }else{
                return  {object:'error : producto no encontrado'}
            }
        } catch (error) {
            return  {object:'error : producto no encontrado'}
        }
    }
    async getAll(){
        try {
            let data = await fs.promises.readFile(productosURL,'utf-8')
            let productList = JSON.parse(data);
            if (productList.length === 0) {
                return {products:`Data esta vacio! Primero debes ingresar un pedido!`};
            } else {
                return {products:productList};
            }
        } catch (error) {
            return console.log(`El archivo no existe!`);
        }
    }
    async deleteById(id){
        try {
            let data = await fs.promises.readFile(productosURL , 'utf-8')
            let productList = JSON.parse(data);
            let pDelete = productList.filter(function(prod) {
                return prod.id !== id; 
            });
            fs.writeFileSync(productosURL, JSON.stringify(pDelete, null, 2));
            return {message:"Producto borrado con exito!"}
        }catch (error) {
            return {error:'producto no encontrado'}
        }
    }
    async deleteAll(){
        let data = await fs.promises.readFile(productosURL , 'utf-8')
        let productList = JSON.parse(data);
        productList = ''
        fs.writeFileSync(productosURL, JSON.stringify(productList, null, 2))
    }
    async createCart(){
        try {
            let dataCart = await fs.promises.readFile(carritoDos , 'utf-8')
            let cartList = JSON.parse(dataCart);
            let cart = {
                id:makeId(cartList),
                timestamp:`${time.calendary} ${time.hour}`,
                producto:[]
            }
            // Los carritos se cargan al reves, para que el ultimo siempre este en el indice 0, para yo usarlo
            cartList.unshift(cart);
            try{
                let thisId = `Id: ${cart.id}`
                await fs.promises.writeFile(carritoDos, JSON.stringify(cartList, null, 2));
                return {message:"Carrito creado con exito", id:thisId }
            } catch(error) {
                return {err: `No se pudo crear el carrito`}
            }
        } catch {
            let cart = {
                id:1,
                timestamp:`${time.calendary} ${time.hour}`,
                producto:[]
            }
            try {
                let thisId = `Id: ${cart.id}`
                await fs.promises.writeFile(carritoDos, JSON.stringify([cart], null, 2));
                return {message:"Carrito creado con exito", id:thisId }
            }catch(error){
                return console.log(`No se pudo crear el carrito`);
            }
        }
    }
    async deleteCart(id){
        try {
            let dataCart = await fs.promises.readFile(carritoDos , 'utf-8')
            let cartList = JSON.parse(dataCart);
            let cartDelete = cartList.filter(function(prod) {
                return prod.id !== id; 
            });
            fs.writeFileSync(carritoDos, JSON.stringify(cartDelete, null, 2));
            return {message:"Carrito borrado con exito!"}
        }catch (error) {
            return {error:`Carrito no encontrado ${error}`}
        }
    }
    async productsInCart(id){
        try {
            let dataCart = await fs.promises.readFile(carritoDos , 'utf-8')
            let cartList = JSON.parse(dataCart);
            let object = cartList.find(evt => evt.id === id);
            if (object) {
                return {object:object.producto}
            }else{
                return {object:'error : Carrito no encontrado'}
            }
        } catch (error) {
            return  {object:'error : Carrito inexistente'}
        }
    }
    async addProductsToCart(id){
        try {
            let dataCart = await fs.promises.readFile(carritoDos , 'utf-8')
            let cartList = JSON.parse(dataCart);
            let dataProducts = await fs.promises.readFile(productosURL, 'utf-8')
            let products = JSON.parse(dataProducts);
            let productIdParams = products.find(prod => prod.id === id);
            cartList[0].producto.push(productIdParams)
            try{
                await fs.promises.writeFile(carritoDos,JSON.stringify(cartList,null,2));
                return {message:"Carrito actualizado"}
            }catch{
                return {message:"No se ha podido actualizar el carrito"}
            }
        } catch (error) {
            return  {object:'error : Carrito inexistente'}
        }
    }
    async deleteProductForId(id,id_prod){
        try {
            let dataCart = await fs.promises.readFile(carritoDos , 'utf-8')
            let cartList = JSON.parse(dataCart);
            let user = cartList.filter(us=>us.id===id);
            let carritoD = user[0].producto.filter(us=>us.id !==id_prod);
            user[0].producto = carritoD;
            try {
                await fs.promises.writeFile(carritoDos,JSON.stringify(cartList,null,2));
                return {a:carritoD,b:user}
            } catch (error) {
                return {object:'error : Carrito inexistente'}
            }
            
        } catch (error) {
            return  {object:'error : Carrito inexistente'}
        }
    }
    
}

export default Contenedor;



