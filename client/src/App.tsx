import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { createApiClient, Order } from './api';
import { OrderModal } from './models'

export type AppState = {
	orders?: Order[],
	search: string;
	selectedOrder: {
		image: string,
		billingInfo: { status: string }
		createdDate: string,
		currency: string,
		customer: {
			id: string,
			name: string
		}
		fulfillmentStatus: string,
		id: number
		itemQuantity: number
		items: any[]
		price: {
			formattedTotalPrice: string,
			total: number
		}
	},
	checkboxes: {
		Delivered: boolean,
		notdelivered: boolean,
	}
}

enum delivererdStatus{
	Delivered = 'Delivered',
	notdelivered ='notdelivered'
}
const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		selectedOrder: {
			image: '',
			billingInfo: { status: '' },
			createdDate: '',
			currency: '',
			customer: {
				id: '',
				name: ''
			},
			fulfillmentStatus: '',
			id: 0,
			itemQuantity: 0,
			items: [],
			price: {
				formattedTotalPrice: '',
				total: 0
			}
		},
		checkboxes:{
			Delivered: true,
			notdelivered: true,
		}
	};

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			orders: await api.getOrders()
		});
	}

	onSearch = async (value: string, newPage?: number) => {

		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: value
			});
		}, 300);
	};

	update_item_status = async (id: string, status:string) => {
		try {
			const response: any = await api.updateOrderStatus(id, status).then(res => res)
			toast.success(response.data.message)
			this.setState({ orders: response.data.orders })
		} catch (e) {
			toast.error("Something went wrong!")
		}

	}

	modalOpen = (order: any) => {
		order.image = "https://source.unsplash.com/1600x900/?nutrition,food"
		this.setState({ selectedOrder: order })
		const modalButton = document.getElementById('modalButton');
		if (modalButton) {
			modalButton.click()
		}
	}

	filterDeliverOrNot = (status: delivererdStatus)=>{
		const {checkboxes} = this.state
		checkboxes[status] = !this.state.checkboxes[status]
		if(checkboxes.Delivered || checkboxes.notdelivered){
			this.setState({checkboxes:{...checkboxes}});
		}else{
			toast.error('Please keep one selected')
		}
	}
	render() {
		const { orders } = this.state;
		return (
			<main>
				<h1>Orders</h1>
				<header>
					<input type="search" placeholder="Search" onChange={(e) => this.onSearch(e.target.value)} />
				</header>
				{orders ? <div className='results'>Showing {orders.length} results 
					<div className="check-boxes">
						<div>
							<label htmlFor="delivered">All</label> &nbsp;&nbsp;
							<input type="checkbox" name="all" id="all" value="Delivered" checked={this.state.checkboxes.Delivered ? true:false} onClick={()=>{
								this.filterDeliverOrNot(delivererdStatus.Delivered)
							}} />
						</div>
						&nbsp;&nbsp;
						<div>
							<label htmlFor="notdelivered">Delivered</label>&nbsp;&nbsp;
							<input type="checkbox" name="notdelivered" id="notdelivered" value="notdelivered" checked={this.state.checkboxes.notdelivered ?true:false} onClick={(e)=>{
								this.filterDeliverOrNot(delivererdStatus.notdelivered)
							}} />
						</div>
					</div>
				</div> : null}
				{orders ? this.renderOrders(orders) : <h2>Loading...</h2>}
				
			</main>
		)
	}

	renderOrders = (orders: Order[]) => {
		const fulfilled = this.state.checkboxes.Delivered?"fulfilled": this.state.checkboxes.notdelivered ? 'not-fulfilled':'both'
		const both  = this.state.checkboxes.Delivered && this.state.checkboxes.notdelivered;
		const filteredOrders = orders
			.filter((order) =>(
			(order.customer.name.toLowerCase() + order.id).includes(this.state.search.toLowerCase()) 
			|| 
			(order.fulfillmentStatus.toLowerCase()).includes(this.state.search.toLowerCase())
			||
			(order.billingInfo.status.toLowerCase()).includes(this.state.search.toLowerCase())
			&&
			!both ? (order.fulfillmentStatus.toLowerCase()).includes(fulfilled.toLowerCase()):''
			));

		return (
			<div className='orders'>
				<button style={{ display: 'none' }} id="modalButton" type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter"></button>
				<OrderModal order={this.state.selectedOrder} />
				{filteredOrders.map((order) => (
					<div className={'orderCard'} onClick={(e) => {
						e.stopPropagation()
						this.modalOpen(order)
					}}>
						<div className={'generalData'}>
							<h6>{order.id}</h6>
							<h4>{order.customer.name}</h4>
							<h5>Order Placed: {new Date(order.createdDate).toLocaleDateString()}</h5>
						</div>
						<div className={'fulfillmentData'}>
							<h4>{order.itemQuantity} Items</h4>
							<img src={App.getAssetByStatus(order.fulfillmentStatus)} />
							{order.fulfillmentStatus !== 'canceled' &&
								<a onClick={(e) => {
									e.stopPropagation()
									order.fulfillmentStatus === 'fulfilled' ? this.update_item_status(order.id.toString(), 'not-fulfilled'):this.update_item_status(order.id.toString(), 'fulfilled')
								}}>Mark as {order.fulfillmentStatus === 'fulfilled' ? 'Not Delivered' : 'Delivered'}</a>
							}
						</div>
						<div className={'paymentData'}>
							<h4>{order.price.formattedTotalPrice}</h4>
							<img src={App.getAssetByStatus(order.billingInfo.status)} />
						</div>
					</div>
				))}
			 <ToastContainer />
			</div>
		)
	};

	static getAssetByStatus(status: string) {
		switch (status) {
			case 'fulfilled':
				return require('./assets/package.png');
			case 'not-fulfilled':
				return require('./assets/pending.png');
			case 'canceled':
				return require('./assets/cancel.png');
			case 'paid':
				return require('./assets/paid.png');
			case 'not-paid':
				return require('./assets/not-paid.png');
			case 'refunded':
				return require('./assets/refunded.png');
		}
	}
}

export default App;
