import fs from 'fs'
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(filename)

function makeId(data){
    let initialId = 1;

    for (var i = 0; i <= data.length; i++) {
        initialId = data.length + 1;
        }
    return initialId;
}
export default makeId;

export const adminOrUser= (req,res,next)=> {
    if(!req.auth){
        let route = req.route.path;
        let method = req.method;
        res.status(403).send({error:-2,descripcion:`ruta ${route} y metodo ${method} no implementada`})
    }else{
        next();
    }
}

export const makeRandomId= (length) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const JSClock = () => {
    let time = new Date();
    // calendary
    let date = time.getDate();
    let month = time.getMonth();
    let year = time.getFullYear();
    const calendary = date + "/" + (month + 1)+ "/" + year 
    // hour
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    let temp = '' + ((hour > 12) ? hour - 12 : hour);
    if (hour == 0)
        temp = '12';
    temp += ((minute < 10) ? ':0' : ':') + minute;
    temp += ((second < 10) ? ':0' : ':') + second;
    temp += (hour >= 12) ? ' P.M.' : ' A.M.';
    return {hour: temp, calendary:calendary};
    }



export const deepCopyFunction = (inObject) => {
    let outObject, value, key
    
    if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
    }
    
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}
    
    for (key in inObject) {
        value = inObject[key]
    
    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopyFunction(value)
    }
    return outObject
}
