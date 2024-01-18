import { Router } from 'express';
import oCartManager from '../CartManager.js';

export const cartsRouter = Router();

// POST : Agrega un nuevo carrito
cartsRouter.post('/carts', async (req, res) => {
    
    try {
        const newCart = await oCartManager.addCart(req.body);
        res.json(newCart);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET : Devuelve los productos del carrito con el ID especificado
cartsRouter.get("/carts/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let oCart = await oCartManager.getCartProducts(id);

    if (oCart) {
        res.json(oCart);
    } else {
        res.status(400).send(`No se encontro el carrito con ID= ${id}`);
    }
});

// POST : Agrega el producto al arreglo “products” del carrito seleccionado
// si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
cartsRouter.post("/carts/:cid/product/:pid", async (req, res) => {
    let cartID = parseInt(req.params.cid);
    let productID = parseInt(req.params.pid);
    let oCart = await oCartManager.updateCart(cartID, productID);

    if (oCart) {
        res.json(oCart);
    } else {
        res.status(400).send(`No se encontro el carrito con ID= ${id}`);
    }
});