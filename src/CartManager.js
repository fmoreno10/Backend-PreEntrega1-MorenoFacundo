import fs2 from 'fs';
import fs from 'fs/promises';

class Cart {
    static #newCartID = 1;
    products = [];

    constructor(oProducts) {
        
        this.id = Cart.#newCartID++;
        this.products = oProducts;
        console.log(this);
    }

}

class CartManager {
    #path;
    constructor(path) {
        this.#path = path;
    }

    /*
    agregará un carrito al arreglo de carritos inicial.
    Al agregarlo, debe crearse con un id autoincrementable
    */
    async addCart(oCart) {
        let id = 0;
        let cartsInFile;
        let oCarts = [];

        if (fs2.existsSync(this.#path)) {
            try {
                // leo los carritos almacenados previamente
                cartsInFile = await fs.readFile(this.#path, 'utf-8');

                // convierto lo leído en el archivo en objetos
                oCarts = JSON.parse(cartsInFile);

            } catch (error) {
                console.log(error);
                return id;
            }
        }

        const oNewCart = new Cart(oCart);

        id = oNewCart.id;

        oCarts.push(oNewCart);
        try {
            // escribo al archivo el array de carritos convertido a texto , le agrego identación para legilibilidad (2)
            await fs.writeFile(this.#path, JSON.stringify(oCarts, null, 2));
        } catch (error) {
            console.log(error);
            return id;
        }

        return id;
    }

    async updateCart(cartID, productID) {
        let id;
        let cartsInFile;
        try {
            // leo los carritos almacenados previamente
            cartsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // Convierto el texto en objetos 
        const oCarts = JSON.parse(cartsInFile);

        // busco el carrito a modificar
        const cartToUpdate = oCarts.find(cart => cart.id === cartID);
        
        // Busco en el array de productos del carrito el ID
        const productInCart = cartToUpdate.products.find(p => p.product === productID);

        if (productInCart) {
            // Si existe, actualizo la cantidad
            productInCart.quantity++;            
        }else{
            // Sino, lo agrego
            cartToUpdate.products.push( {product: productID, quantity: 1 });            
        }

        // escribo al archivo el array de carritos convertido a texto , le agrego identación para legilibilidad (2)
        await fs.writeFile(this.#path, JSON.stringify(oCarts, null, 2));

        return cartToUpdate;

    }

    async deleteCart(cartID) {
        let cartsInFile;
        let id;
        try {
            // leo los carritos almacenados previamente
            cartsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        const oCarts = JSON.parse(cartsInFile);
        // Elimino el carrito que coincide con el ID, creo un nuevo array que no lo incluya
        const newCarts = oCarts.filter(cart => cart.id !== cartID);

        // escribo al archivo el array de carritos nuevo convertido a texto , le agrego identación para legilibilidad (2)
        await fs.writeFile(this.#path, JSON.stringify(newCarts, null, 2));


    }

    // debe devolver el arreglo con todos los carritos creados hasta ese momento
    // Agrego un limite para devolver solo la cantidad indicada
    async getCarts(limit) {
        let cartsInFile;

        try {
            // leo los carritos almacenados previamente
            cartsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos y devuelvo
        let oCarts = JSON.parse(cartsInFile);

        if (limit) {
            return oCarts.slice(0, limit);
        } else {
            return oCarts;
        }
    }

    /*
    el cual debe buscar en el arreglo el carrito que coincida con el id
    En caso de no coincidir ningún id, mostrar en consola un error “Not found”
    */
    async getCartById(cartID) {
        let cartsInFile;
        try {
            // leo los carritos almacenados previamente
            cartsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos
        const oCarts = JSON.parse(cartsInFile);

        return oCarts.find(cart => cart.id === cartID);

    }

    // Devuelve los productos del carrito con el ID especificado
    async getCartProducts(cartID) {
        let cartsInFile;
        try {
            // leo los carritos almacenados previamente
            cartsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos
        const oCarts = JSON.parse(cartsInFile);

        return oCarts.find(cart => cart.id === cartID).products;

    }

}

const sPath = './carts.json';

const oCartManager = new CartManager(sPath);

export default oCartManager;