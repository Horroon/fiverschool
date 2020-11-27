import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { createApiClient, Order } from './api';
import { OrderModal } from './models';
import { AddProduct } from './pages/add.product';

export type AppState = {
	orders?: Order[],
	search: string;
	limit: {
		from: number,
		to: number,
	},
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
	},
	isNewProduct: boolean,
	sort: {
		byName: boolean,
		byPrice: boolean,
		byDate: boolean,
	}
}

enum delivererdStatus {
	Delivered = 'Delivered',
	notdelivered = 'notdelivered'
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
		checkboxes: {
			Delivered: true,
			notdelivered: true,
		},
		limit: {
			from: 0,
			to: 20
		},
		isNewProduct: false,
		sort: {
			byName: true,
			byPrice: true,
			byDate: true,
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

	update_item_status = async (id: string, status: string) => {
		try {
			const response: any = await api.updateOrderStatus(id, status).then(res => res)
			toast.success(response.data.message)
			this.setState({ orders: response.data.orders })
		} catch (e) {
			toast.error("Something went wrong!")
		}

	}

	modalOpen = (order: any) => {
		this.setState({ selectedOrder: order })
		const modalButton = document.getElementById('modalButton');
		if (modalButton) {
			modalButton.click()
		}
	}

	filterDeliverOrNot = (status: delivererdStatus) => {
		const { checkboxes } = this.state
		checkboxes[status] = !this.state.checkboxes[status]
		if (checkboxes.Delivered || checkboxes.notdelivered) {
			this.setState({ checkboxes: { ...checkboxes } });
		} else {
			toast.error('Please keep one selected')
		}
	}

	returnBoolean = (order: any, isExist: boolean) => {
		isExist = (order?.customer?.name.toLowerCase() + order.id).includes(this.state.search.toLowerCase());
		isExist = !isExist ? (order?.fulfillmentStatus?.toLowerCase()).includes(this.state.search.toLowerCase()) : isExist;
		isExist = !isExist ? (order?.billingInfo?.status?.toLowerCase()).includes(this.state.search.toLowerCase()) : isExist;
		isExist = !isExist ? (order?.customer?.name?.toLowerCase() + order.id).includes(this.state.search.toLowerCase()) : isExist;
		!isExist && order.items.map((item: any) => {
			if (item?.images?.name.toLowerCase().includes(this.state.search.toLowerCase())) {
				isExist = true
			}
		})
		return isExist
	}

	loaderMoreRecord = async (sign: string) => {
		const { limit } = this.state
		limit.from = sign == '+' ? limit.from + 10 : limit.from - 10;
		limit.to = sign == '+' ? limit.to + 10 : limit.to - 10
		const response: any = await api.loadMore(limit.from, limit.to);
		if (response.data.records.length) {
			this.setState({ orders: response.data.records, limit })
		} else {
			toast.warning("No more record found")
		}
	}

	sortMethod = (item1: any, item2: any, sorttype: any) => {
		if (sorttype.byPrice && !sorttype.byName) {
			if (item1.price.total > item2.price.total) {
				return -1;
			}
			if (item1.price.total < item2.price.total) {
				return 1;
			}
		}
		else if (sorttype.byName && !sorttype.byPrice) {
			if (item1.customer.name < item2.customer.name) {
				return -1;
			}
			if (item1.customer.name > item2.customer.name) {
				return 1;
			}
		}
		else if (sorttype.byDate && !sorttype.byName && !sorttype.byPrice) {
			if (item1.createdDate < item2.createdDate) {
				return -1;
			}
			if (new Date(item1.createdDate) > new Date(item2.createdDate)) {
				return 1;
			}
		}
		return 0;
	}

	handleSort = (e: any) => {
		const { target: { value } } = e
		const { sort } = this.state
		if (value == "no") {
			sort.byDate = false;
			sort.byName = false;
			sort.byPrice = false;
		} else if (value == 'd') {
			sort.byDate = true;
			sort.byName = false;
			sort.byPrice = false;

		} else if (value == 'p') {
			sort.byDate = false;
			sort.byName = false;
			sort.byPrice = true;

		} else if (value == 'n') {
			sort.byDate = false;
			sort.byName = true;
			sort.byPrice = false;
		}
		this.setState({ sort: { ...sort } })
	}

	render() {
		const { orders = [], limit, isNewProduct, sort } = this.state;
		const isPrv = limit.from > 0 ? false : true
		if (isNewProduct) {
			return <AddProduct />
		} else {
			return (
				<main>
					<h1>Orders</h1>
					<header>
						<input type="search" placeholder="Search" onChange={(e) => this.onSearch(e.target.value)} />
					</header>
					<div>
						<button className="btn btn-primary btn-sm" onClick={() => this.setState({ isNewProduct: true })}>Add Product</button>
					</div>
					{orders ?
						<div className='results'>Showing {orders ? this.renderOrders(orders).results == orders.length ? `from ${limit.from + 1} to ${limit.to}` : this.renderOrders(orders).results : '0'} results
					 &nbsp;&nbsp;
					<div className="check-boxes">
								
								<div>
									<label htmlFor="delivered">Not Delivered</label> &nbsp;&nbsp;
								<input type="checkbox" name="all" id="all" value="Delivered" checked={this.state.checkboxes.Delivered ? true : false} onClick={() => {
										this.filterDeliverOrNot(delivererdStatus.Delivered)
									}} />
								</div>
								&nbsp;&nbsp;
							<div>
									<label htmlFor="notdelivered">Delivered</label>&nbsp;&nbsp;
								<input type="checkbox" name="notdelivered" id="notdelivered" value="notdelivered" checked={this.state.checkboxes.notdelivered ? true : false} onClick={(e) => {
										this.filterDeliverOrNot(delivererdStatus.notdelivered)
									}} />
								</div>
								&nbsp;&nbsp;
								<div style={{ marginTop: -7 }}>
									<button className="btn btn-primary btn-sm" onClick={() => this.loaderMoreRecord('-')} disabled={isPrv}>Previous</button>
								</div>
								&nbsp;&nbsp;
								<div style={{ marginTop: -7 }}>
									<button className="btn btn-primary btn-sm" onClick={() => this.loaderMoreRecord('+')}>Next</button>
								</div>
								
								&nbsp;&nbsp;
								<div className="form-group " style={{marginTop: -10}}>
									<select className="form-control" onChange={this.handleSort}>
										<option value='no'>No Sort</option>
										<option value='d'>By Date</option>
										<option value='n'>By Name</option>
										<option value='p'>By Price</option>
									</select>
								</div>
							</div>
						</div> : null}
					{orders ? this.renderOrders(orders).orders : <h2>Loading...</h2>}

				</main>
			)
		}
	}

	renderOrders = (orders: Order[]) => {
		const fulfilled = this.state.checkboxes.Delivered ? "fulfilled" : this.state.checkboxes.notdelivered ? 'not-fulfilled' : 'both'
		const both = this.state.checkboxes.Delivered && this.state.checkboxes.notdelivered;
		const filteredOrders = orders
			.filter((order: any) => {
				if (both) {
					let isExist = false
					isExist = this.returnBoolean(order, isExist);
					return isExist
				}
				else {
					let isExist = false
					if (fulfilled === 'fulfilled') {
						if (!this.state.search) {
							isExist = !isExist ? !(order.fulfillmentStatus.toLowerCase()).includes('not-fulfilled') : isExist;
						} else {
							if (order.fulfillmentStatus == 'fulfilled') {
								isExist = this.returnBoolean(order, isExist);
							}
						}
					}
					else if (fulfilled === 'not-fulfilled') {
						if (!this.state.search) {
							isExist = !isExist ? (order.fulfillmentStatus.toLowerCase()).includes('not') : isExist;
						} else {
							if (order.fulfillmentStatus == 'not-fulfilled') {

								isExist = this.returnBoolean(order, isExist);
							}
						}
					}
					return isExist
				}
			}

			)
		const compare = (a: any, b: any) => {
			if (a.price.total > b.price.total) {
				return -1;
			}
			if (a.price.total < b.price.total) {
				return 1;
			}
			return 0;
		}
		const sortedResult = filteredOrders.sort((a, b) => this.sortMethod(a, b, this.state.sort));
		return ({
			results: filteredOrders.length, orders: (
				<div className='orders'>
					<button style={{ display: 'none' }} id="modalButton" type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter"></button>
					<OrderModal order={this.state.selectedOrder} />
					{sortedResult.map((order) => (
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
										order.fulfillmentStatus === 'fulfilled' ? this.update_item_status(order.id.toString(), 'not-fulfilled') : this.update_item_status(order.id.toString(), 'fulfilled')
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
		})
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
