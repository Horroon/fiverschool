import React, { ReactElement, Props } from 'react';

export interface OrderItemFace {
  image:string,
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
}
export const OrderModal: React.FC<{ order: OrderItemFace }> = React.memo(({ order }): ReactElement => {
  return <>
    <div className="modal fade" id="exampleModalCenter" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{order.customer.name}</h3>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="container my-30 px-0">
              <img src={order.image} className="image" height={200} width={'100%'} />
            </div>
            <form className="needs-validation">
              <div className="form-row">
                <div className="col-md-6 mb-4">
                  <label>currency</label>
                  <input type="text" className="form-control" id="validationCustom01" placeholder="First name" value={order.currency} disabled />
                </div>
                <div className="col-md-6 mb-4">
                  <label >Quantity</label>
                  <input type="text" className="form-control" id="validationCustom02" placeholder="Last name" value={order.itemQuantity} disabled />
                </div>
                <div className="col-md-6 mb-4">
                  <label>Date</label>
                  <input type="text" className="form-control" id="date" placeholder="Date" value={new Date(order.createdDate).toLocaleString()} disabled />
                </div>
                <div className="col-md-6 mb-4">
                  <label>Billing Status</label>
                  <input type="text" className="form-control" id="date" placeholder="Date" value={order.billingInfo.status} disabled />
                </div>
                
                <div className="col-md-6 mb-4">
                  <label>Total Price</label>
                  <input type="text" className="form-control" id="date" placeholder="Date" value={order.price.total} disabled />
                </div>
              </div>
            </form>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </>
})
