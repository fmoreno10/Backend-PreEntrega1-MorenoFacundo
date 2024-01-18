import { Router } from 'express';
import oCartManager from '../CartManager.js';

export const cartsRouter = Router();

// GET : Devuelve los carritos
cartsRouter.get("/carts", async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        let oCarts = await oCartManager.getCarts(limit);
        res.send(oCarts);
    } catch (error) {
        console.log(error);
    }

});

// GET : Devuelve el carrito con el ID especificado
cartsRouter.get("/carts/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let oCart = await oCartManager.getCartById(id);

    if (oCart) {
        res.json(oCart);
    } else {
        res.status(400).send(`No se encontro el carrito con ID= ${id}`);
    }
});

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

// PUT : Modifica el carrito con el ID especificado
cartsRouter.put('/carts/:id', async (req, res) => {
        
    const cartID = parseInt(req.params.id);
    try {
        const updatedCart = await oCartManager.updateCart(cartID, req.body);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE : Borra el carrito con el ID especificado
cartsRouter.delete('/carts/:id', async (req, res) => {
    const cartID = parseInt(req.params.id);
    try {
        const deletedCart = await oCartManager.deleteCart(cartID);
        res.json(deletedCart);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

