import express from 'express';
import bodyParser = require('body-parser');
import path, { resolve } from 'path';
import fs, { writeFileSync } from 'fs';
const orderFilePath = './orders.json';
const {products} = require('./products.json');


const app = express();
let allOrders: any[] = require(orderFilePath);

const PORT = 3232;
const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/api/orders', (req, res) => {
	const page = <number>(req.query.page || 1);
	const orders: any[] = allOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const modifiedOrders = orders.map(order=>{
		order.items.map((item:any)=>{
			item.images = products[item.id]
			return item
		});
		return order
	})
	res.send(modifiedOrders);
});

app.get('/api/items/:itemId', (req, res) => {
	const itemId = <string>(req.params.itemId);
	const size = <string>(req.query.size || 'large');
	const product = products[itemId];
	res.send({
		id: itemId,
		name: product.name,
		price: product.price,
		image: product.images[size]
	});
});
app.get('/api/order/update/:orderId', (req, res)=>{
	
	const page = <number>(req.query.page || 1);
	const orderId = parseInt(<string>(req.params.orderId))
	const status = <string>(req.query.status)
		const ORDERS = allOrders;
		const updatedOrders = ORDERS.map((order:any)=>{
			if(order.id === orderId){
				order.fulfillmentStatus = status
			}
			return order
		})

		allOrders = updatedOrders
		res.send({status: 200, message:'Successfully updated', orders: allOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)})
		
})

app.get('/api/loadmore/orders', (req,res)=>{
	const from = parseInt(<string>(req.query.from))
	const to = parseInt(<string>(req.query.to))
	res.send({records: allOrders.slice(from, to)})
})

app.listen(PORT);
console.log('Listening on port', PORT);
