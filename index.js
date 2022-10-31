const http = require('express');
const MongoClient = require('mongodb').MongoClient
const app = express()

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

app.use(express.json())
var database

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS API Project for Mongodb',
            version: '1.0.0'
        },
        servers: [{
            url: 'http://localhost:5000/'
        }]
    },
    apis: ['./mongodb.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swagger.Ui.setup(swaggerSpec))
app.get('/', (req, resp) => {
    resp.send('Welcome to mongodb API')
})

app.get('/api/books', (req, resp) => {
    database.collection('books').find({}).toArray((err, result) => {
        if (err) throw err
        resp.send(result)
    })
})

app.get('api/books/:id', (req, resp) => {
    database.collection('books').find({ id: parseInt(req.params.id) }).toArray((err, result) => {
        if (err) throw err
        resp.send(result)
    })
})

app.post('api/books/addBook', (req, resp) => {
    let res = database.collection('books').find({}).sort({ id: 01 }).limit(1)
    res.forEach(obj => {
        if (obj) {
            let book = {
                id: obj.id + 1,
                title: req.body.title
            }
            database.collection('books').insertOne(book, (err, result) => {
                if (err) resp.status(500).send(err)
                resp.send("Added Successfully")
            })
        }
    })
})

app.put('/api/books/:id', (req, resp) => {
    let book = {
        id: parseInt(req.params.id),
        title: req.body.title
    }
    database.collection('books').updateOne({ id: parseInt(req.params.id) }, { $set: book }, (err, result) => {
        if (err) throw err
        resp.send(book)
    })
})
app.delete('/api/books/:id', (req, resp) => {
    database.collection('books').deleteOne({ id: parseInt(req.params.id) }, (err, result) => {
        if (err) throw err
        resp.send('Book is deleted')
    })
})

app.listen(5000, () => {
        MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, result) => {
            if (error) throw error
            database = result.db('mydatabase')
            console.log('Connection successful!')
        })
    })
    // http.createServer((req, resp) => {
    //     resp.writeHead(200, { 'Content-Type': 'application\json' });
    //     resp.write(JSON.stringify(data));
    //     resp.end();
    // }).listen(5000)