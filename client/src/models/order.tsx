import React, { ReactElement, Props } from 'react';

export interface OrderItemFace {
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
}

const ItemsImagesCarousel: React.FC<{ items: any[] }> = ({ items }) => (
<div id="carouselExampleIndicators" className="carousel slide" style={{ height: '60vh' }} data-ride="carousel">
  <ol className="carousel-indicators">
    {
      items.map((item, i) => (
        <li data-target="#carouselExampleIndicators" data-slide-to={`${i}`} className={i == 0 ? "active" : ''} />))
    }
  </ol>
  <div className="carousel-inner">
    {
      items.map(
        (item, i) => (
          <div className={`carousel-item ${i == 0 ? "active" : ''}`} >
            <img className="d-block w-100 h-76" style={{ height: '60vh' }} src={item.images.images.medium} alt="First slide" />
          </div>)
      )
    }

  </div>
  <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Next</span>
  </a>
</div>
)


export const OrderModal: React.FC<{ order: OrderItemFace }> = React.memo(({ order }): ReactElement => {
  return <>
    <div className="modal fade" id="exampleModalCenter" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '50%' }} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{order.customer.name}</h3>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="container my-30 px-0">
              {
                ItemsImagesCarousel({ items: order.items })
              }
              {
                // <img src={order.image} className="image image-border" height={200} width={'100%'} />
              }
            </div>
            <form className="needs-validation">
              <div className="form-row">
                <div className="col-md-6 mb-4 mt-4">
                  <label>Currency</label>
                  <input type="text" className="form-control" id="validationCustom01" placeholder="First name" value={order.currency} disabled />
                </div>
                <div className="col-md-6 mb-4 mt-4">
                  <label >Total Quantity</label>
                  <input type="text" className="form-control" id="validationCustom02" placeholder="Last name" value={order.itemQuantity} disabled />
                </div>
                <div className="col-md-12 mb-4">
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
                {
                  order.items.map((quantity, i) => {
                    return <>
                      <div className="col-md-6 mb-4 mt-10" >
                        <label>Product Name</label>
                        <input type="text" className="form-control" id="date" placeholder="Date" value={quantity.images.name} disabled />
                      </div>

                      <div className="col-md-6 mb-4 mt-10" >
                        <label>Quantity</label>
                        <input type="text" className="form-control" id="date" placeholder="Date" value={quantity.quantity} disabled />
                      </div>
                    </>
                  })
                }
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
