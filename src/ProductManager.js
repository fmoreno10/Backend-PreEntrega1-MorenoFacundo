import fs2 from 'fs';
import fs from 'fs/promises';

class Product {
    static #newProductID = 1;

    constructor({ title, description, price, thumbnails, code, stock, status = true, category }) {
        // Validaciones
        if (!title || !description || !price || !thumbnails || !code || !stock || !category) throw new Error('Los campos no pueden estar vacíos.');

        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnails = thumbnails;
        this.code = code;
        this.stock = stock;
        this.id = Product.#newProductID++;
        this.status = status;
        this.category = category;
    }

}

class ProductManager {
    #path;
    constructor(path) {
        this.#path = path;
    }

    /*
    agregará un producto al arreglo de productos inicial.
    Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    Al agregarlo, debe crearse con un id autoincrementable
    
    */
    async addProduct(oProduct) {
        let id = 0;
        let productsInFile;
        let oProducts = [];

        if (fs2.existsSync(this.#path)) {
            try {
                // leo los productos almacenados previamente
                productsInFile = await fs.readFile(this.#path, 'utf-8');

                // convierto lo leído en el archivo en objetos
                oProducts = JSON.parse(productsInFile);

                if (oProducts.some(product => product.code === oProduct.code)) {
                    // No se carga el producto si tiene el mismo codigo
                    return -1;
                }

            } catch (error) {
                console.log(error);
                return id;
            }
        }

        const oNewProduct = new Product(oProduct);

        id = oNewProduct.id;

        oProducts.push(oNewProduct);
        try {
            // escribo al archivo el array de productos convertido a texto , le agrego identación para legilibilidad (2)
            await fs.writeFile(this.#path, JSON.stringify(oProducts, null, 2));
        } catch (error) {
            console.log(error);
            return id;
        }

        return id;
    }

    async updateProduct(productID, fieldsToUpdate) {
        let id;
        let productsInFile;
        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        //NO DEBE BORRARSE SU ID 
        const oProducts = JSON.parse(productsInFile);
        
        // busco el producto a modificar
        const productToUpdate = oProducts.find(product => product.id === productID);
        
        // Creo un objeto con los campos del producto a actualizar 
        const updatedProduct = {
            ...productToUpdate,
            ...fieldsToUpdate
        };


        // Elimino el producto que coincide con el ID, creo un nuevo array que no lo incluya
        const newProducts = oProducts.filter(product => product.id !== productID);

        // Agrego el producto modificado
        newProducts.push(updatedProduct);

        // escribo al archivo el array de productos convertido a texto , le agrego identación para legilibilidad (2)
        await fs.writeFile(this.#path, JSON.stringify(newProducts, null, 2));

        return updatedProduct;

    }

    async deleteProduct(productID) {
        let productsInFile;
        let id;
        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        const oProducts = JSON.parse(productsInFile);
        // Elimino el producto que coincide con el ID, creo un nuevo array que no lo incluya
        const newProducts = oProducts.filter(product => product.id !== productID);

        // escribo al archivo el array de productos nuevo convertido a texto , le agrego identación para legilibilidad (2)
        await fs.writeFile(this.#path, JSON.stringify(newProducts, null, 2));


    }

    // debe devolver el arreglo con todos los productos creados hasta ese momento
    // Agrego un limite para devolver solo la cantidad indicada
    async getProducts(limit) {
        let productsInFile;

        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos y devuelvo
        let oProducts = JSON.parse(productsInFile);

        if (limit) {
            return oProducts.slice(0, limit);
        } else {
            return oProducts;
        }
    }

    /*
    el cual debe buscar en el arreglo el producto que coincida con el id
    En caso de no coincidir ningún id, mostrar en consola un error “Not found”
    */
    async getProductById(productID) {
        let productsInFile;
        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos
        const oProducts = JSON.parse(productsInFile);

        return oProducts.find(product => product.id === productID);

    }

}

const sPath = './products.json';

const oProductManager = new ProductManager(sPath);

export default oProductManager;