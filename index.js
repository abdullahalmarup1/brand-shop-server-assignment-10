const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://DB_USER:DB_PASS@cluster0.uworera.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// middleWare started

app.use(cors());
app.use(express.json());

// middleWare end 


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("brand-shop-db");
        const brandsCollection = database.collection("brands");
        const productsCollection = database.collection("products");
        const cartsCollection = database.collection("cart");

        // brands data

        app.get("/brands", async (req, res) => {
            try {
                const brands = await brandsCollection.find().toArray();
                res.send(brands);
            }
            catch (error) {
                console.log(error)
            }
        });


        // products data

        app.get("/products", async (req, res) => {
            try {
                const query = req.query;
                const products = await productsCollection.find(query).toArray();
                res.send(products);
            }
            catch (error) {
                console.log(error)
            }
        });


        // product data

        app.get("/product/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                // console.log(query)
                const singleProduct = await productsCollection.findOne(query);
                res.send(singleProduct);
            }
            catch (error) {
                console.log(error)
            }
        });

        // app.get("/products/:brand_name", async (req, res) => {
        //     try {
        // console.log (req.params);
        // const query = req.query;

        //         const brand_name = { brand_name: req.params.brand_name };
        //         const products = await productsCollection.find(brand_name).toArray();
        //         res.send(products);
        //     }
        //     catch (error) {
        //         console.log(error)
        //     }
        // });


        app.get("/myCart", async (req, res) => {
            try {
                const query = { OwnerEmail: req.query?.email };
                if (req.query) {
                    const products = await cartsCollection.find(query).toArray();
                    res.send(products);
                }
                else {
                    res.send([])
                }
            }
            catch (error) {
                console.log(error)
            }
        });


        app.post("/addToCart", async (req, res) => {
            const body = req.body
            console.log(body)
            const result = await cartsCollection.insertOne(body)
            res.send(result)
        });

        // addProduct
        app.post("/addCar", async (req, res) => {
            const body = req.body
            console.log(body)
            const result = await productsCollection.insertOne(body)
            res.send(result)
        });


        app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.deleteOne(query)
            res.send(result)
        })


        app.put("/product/:id", async (req, res) => {
            const id = req.params.id
            const updateData = req.body
            const query = { _id: new ObjectId(id) }
            const data = {
                $set: {
                    ...updateData
                }
            }
            const result = await productsCollection.updateOne(query, data)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



// brandShopAdmin
// B8ZZ5QA3N3dQ4XQm