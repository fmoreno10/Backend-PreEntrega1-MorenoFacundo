import { Router } from 'express';
import oProductManager from '../ProductManager.js';

export const productsRouter = Router();

// GET : Devuelve los productos
productsRouter.get("/products", async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        let oProducts = await oProductManager.getProducts(limit);
        res.send(oProducts);
    } catch (error) {
        console.log(error);
    }

});

// GET : Devuelve el producto con el ID especificado
productsRouter.get("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let oProduct = await oProductManager.getProductById(id);

    if (oProduct) {
        res.json(oProduct);
    } else {
        res.status(400).send(`No se encontro el producto con ID= ${id}`);
    }
});

// POST : Agrega un nuevo producto
productsRouter.post('/products', async (req, res) => {
    
    try {
        const newProduct = await oProductManager.addProduct(req.body);
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// PUT : Modifica el producto con el ID especificado
productsRouter.put('/products/:id', async (req, res) => {
        
    const productID = parseInt(req.params.id);
    try {
        const updatedProduct = await oProductManager.updateProduct(productID, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE : Borra el producto con el ID especificado
productsRouter.delete('/products/:id', async (req, res) => {
    const productID = parseInt(req.params.id);
    try {
        const deletedProduct = await oProductManager.deleteProduct(productID);
        res.json(deletedProduct);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

