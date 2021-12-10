import express from 'express';
import Contenedor from '../classes/Contenedor.js';
import upload from '../services/upload.js'
import {io} from '../app.js';
import { adminOrUser} from '../utils.js';

const router = express.Router();
const contenedor = new Contenedor();

router.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log('Petición hecha a las: '+time.toTimeString().split(" ")[0])
    req.auth = admin;
    next()
})

const admin = true;

// GET
router.get('/:id/productos' , (req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.productsInCart(id).then(result=>{
        res.send(result);
    })
})


//POST
router.post('/',(req,res)=>{
    contenedor.createCart().then(result=>{
        res.send(result);
    })
})

router.post('/:id/productos',(req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.addProductsToCart(id).then(result=>{
        res.send(result);
    })
})

//DELETE 
router.delete('/:id',(req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.deleteCart(id).then(result=>{
        res.send(result);
    })
})

router.delete('/:id/productos/:id_prod',(req,res)=>{
    let id= parseInt(req.params.id);
    let id_prod= parseInt(req.params.id_prod);
    contenedor.deleteProductForId(id,id_prod).then(result=>{
        res.send(result);
    })
})



export default router;