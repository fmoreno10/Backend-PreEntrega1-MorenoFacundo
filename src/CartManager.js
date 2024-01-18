import fs2 from 'fs';
import fs from 'fs/promises';

class Cart {
    static #newCartID = 1;

    constructor({ title, description, price, thumbnails, code, stock, status = true, category }) {
        // Validaciones
        if (!title || !description || !price || !thumbnails || !code || !stock || !category) throw new Error('Los campos no pueden estar vacíos.');

        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnails = thumbnails;
        this.code = code;
        this.stock = stock;
        this.id = Cart.#newCartID++;
        this.status = status;
        this.category = category;
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

    async updateCart(cartID, fieldsToUpdate) {
        let id;
        let cartsInFile;
        try {
            // leo los carritos almacenados previamente
            cartsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        //NO DEBE BORRARSE SU ID 
        const oCarts = JSON.parse(cartsInFile);

        // busco el carrito a modificar
        const cartToUpdate = oCarts.find(cart => cart.id === cartID);
        
        // Creo un objeto con los campos del carrito a actualizar 
        const updatedCart = {
            ...cartToUpdate,
            ...fieldsToUpdate
        };


        // Elimino el carrito que coincide con el ID, creo un nuevo array que no lo incluya
        const newCarts = oCarts.filter(cart => cart.id !== cartID);

        // Agrego el carrito modificado
        newCarts.push(updatedCart);

        // escribo al archivo el array de carritos convertido a texto , le agrego identación para legilibilidad (2)
        await fs.writeFile(this.#path, JSON.stringify(newCarts, null, 2));

        return updatedCart;

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

}

const sPath = './carts.json';

const oCartManager = new CartManager(sPath);

export default oCartManager;