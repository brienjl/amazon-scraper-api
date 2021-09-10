const express = require('express');
const request = require('request-promise');
require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


const app = express();
const PORT = process.env.PORT || 5000;
const apiKey = process.env.API_KEY;
const baseUrl = `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Amazon Scraper API',
            version: '1.0.0'
        }
    },
    apis: ['index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Amazon Products API.');
});

/**
 * @swagger
 * /products/{productId}:
 *      get:
 *          description: Get product by productId
 *          parameters:
 *              - productId: productId
 *                description: Amazon Product Id
 *                in: formData
 *                required: true
 *                type: String
 *          responses:
 *              200:
 *                  description: Success
 */
app.get('/products/:productId', async(req, res) => {
    const { productId } = req.params;

    try {
        const response = await request(`${baseUrl}&url=https://www.amazon.com/dp/${productId}`)
        res.json(JSON.parse(response));
    } catch(error) {
        res.json(error);
    }
});

//GET Product Reviews
app.get('/products/:productId/reviews', async(req, res) => {
    const { productId } = req.params;

    try {
        const response = await request(`${baseUrl}&url=https://www.amazon.com/product-reviews/${productId}`)
        res.json(JSON.parse(response));
    } catch(error) {
        res.json(error);
    }
});

//GET Product Offers
app.get('/products/:productId/offers', async(req, res) => {
    const { productId } = req.params;

    try {
        const response = await request(`${baseUrl}&url=https://www.amazon.com/gp/offer-listing/${productId}`)
        res.json(JSON.parse(response));
    } catch(error) {
        res.json(error);
    }
});

//GET Search Products Results
app.get('/search/:searchQuery', async(req, res) => {
    const { searchQuery } = req.params;

    try {
        const response = await request(`${baseUrl}&url=https://www.amazon.com/s?k=${searchQuery}`)
        res.json(JSON.parse(response));
    } catch(error) {
        res.json(error);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));