import React, { ReactElement, Props } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import { createApiClient, Order } from '../api';

const api = createApiClient();
export const AddProduct: React.FC = (): ReactElement => {
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [largeImage, setLargeImage] = React.useState('');
  const [smallImage, setSmallImage] = React.useState('');
  const [mediumImage, setMediumImage] = React.useState('');

  const submitRecord = async() => {
    if ((name && price) && (largeImage || smallImage || mediumImage)) {
      const item: { name: string, price: string, images: { original: string, large: string, medium: string, small: string } } = { name: '', price: '', images: { original: '', large: '', small: '', medium: '' } }
      item.name = name;
      item.price = price
      item.images.original = largeImage;
      item.images.large = largeImage;
      item.images.medium = mediumImage;
      item.images.small = smallImage
		  const response:any = await api.addProduct(item)
      if(response.data.status){
        toast.success('Product added')
      }else{
        toast.error('Something went wrong')
      }
    } else {
      toast.error('Please enter values')
    }
  }
  return <div className="container">
    <form className="w-50 mx-auto">
      <div className="title">
        <h1>Add New Product</h1>
      </div>
      <div className="form-group">
        <label>Product Name: </label>
        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="First Name" onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Product Price</label>
        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Product Price" onChange={(e) => setPrice(e.target.value)} />
      </div>

      <div className='row'>
        <div className="form-group col-6">
          <label>OriginalImage-URL</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="past url here" onChange={(e) => setLargeImage(e.target.value)} />
        </div>
        <div className="form-group col-6">
          <label>MediumImage-URL</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="past url here" onChange={(e) => setMediumImage(e.target.value)} />
        </div>
        <div className="form-group col-6">
          <label>SmallImage-URL</label>
          <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="past url here" onChange={(e) => setSmallImage(e.target.value)} />
        </div>
      </div>
      <div className="row" style={{marginTop:20}}>
        <div className="form-group col-6 mt-10">
          <input value="Submit" className="btn btn-success btn-md" onClick={submitRecord} />
        </div>
        
        <div className="form-group col-6 mt-10">
          <input type="submit" value="Back To Order Page" className="btn btn-success btn-md" />
        </div>
       </div>
    </form>
    <ToastContainer />
  </div>
} 