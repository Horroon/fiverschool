import axios from 'axios';
import { Id } from 'react-toastify';

export type Customer = {
	name: string;
}

export type BillingInfo = {
	status: string;
}

export type Price = {
	formattedTotalPrice: string;
}

export type Order = {
	id: number;
	createdDate: string;
	fulfillmentStatus: string;
	billingInfo: BillingInfo;
	customer: Customer;
	itemQuantity: number;
	price: Price;
}

export type Item = {
	id: string;
	name: string;
	price: number;
	image: string;
}

export type ApiClient = {
	getOrders: () => Promise<Order[]>;
	getItem: (itemId: string) => Promise<Item>;
	updateOrderStatus:(orderId:string, status:string) => Promise<Item>,
	loadMore: (from:number, to:number) => Promise<Item>;
}

export const createApiClient = (): ApiClient => {
	return {
		getOrders: () => {
			return axios.get(`http://localhost:3232/api/orders`).then((res) => res.data);
		},
		getItem: (itemId: string) => {
			return axios.get(`http://localhost:3232/api/items/${itemId}`).then((res) => res.data);
		},
		updateOrderStatus: (orderId:string, status:string)=> axios.get(`http://localhost:3232/api/order/update/${orderId}`,{
			params:{status: status}
		}),
		loadMore: (from:number, to: number) => axios.get('http://localhost:3232/api/loadmore/orders',{
			params:{
				from:from,
				to:to
			}
		})
	}
};



