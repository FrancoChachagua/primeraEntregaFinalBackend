import express from 'express';
import Contenedor from '../classes/Contenedor.js';
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

router.get('/:id?', (req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.getById(id).then(result=>{
        res.send(result.object);
    })
})

// POST

router.post('/' ,adminOrUser,(req,res)=>{
    let product = req.body;
    product.precio = parseInt(product.precio);
    console.log(req.body);
    contenedor.save(product).then(result=>{
        res.send(result);
        if(result.message==="Pedido creado con exito"){
            contenedor.getAll().then(result=>{
                io.emit('realTimeCards', result)
            })
        }
    })
})


//PUT

router.put('/:id',adminOrUser,(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.id);
    console.log(body,id);
    contenedor.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})


// DELETE

router.delete('/:id', adminOrUser , (req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.deleteById(id).then(result=>{
        res.send(result)
    })
})

export default router;