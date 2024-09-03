import React, { useEffect, useState } from 'react'
import SellerNavbar from './SellerNavbar'
import styles from '../CSS/SellerCSS/AddProduct.module.css'
import {setLine} from '../../Redux/Features/UnderlineSlice'
import { useSelector,useDispatch } from 'react-redux'
import 'dropzone/dist/dropzone.css';
import DropzoneC from '../DropzoneC';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faDiceD6,faTag,faCircleInfo,faBoxesStacked} from '@fortawesome/free-solid-svg-icons';
import { triggerNotification } from '../Notification'
import axios from 'axios'
import ProductCard from '../../ProductCard'
const AddProduct = () => {
  const [check ,setCheck]  = useState(false);
  const [data, setData] = useState({product:'', price:'', description:'',stock:'',sellerName:''})
  const [ image ,setImage ] = useState([]);
  const dispatch = useDispatch() ;
  dispatch(setLine(4))
  const onImageAdded= (file) =>{ 
    //  handlepreview()
     setImage((e)=> { return [...e,file]})
  }
 useEffect(()=>{
    if( image.length >5){
      triggerNotification("your Image limit is More than 5","error")
    }
    handlepreview();
 },[image])
  const onFilesRemove = (removedFile)=>{
    // handlepreview();  
    setImage((e)=> e.filter((file)=> file !== removedFile))
  }

  const baseurl = process.env.REACT_APP_SELLER_BASE_URL || '';
  const token = localStorage.getItem('token') || '';
  const number = new RegExp("^[0-9]+$")
  const product = new RegExp(`^[\\$#@^&*(){}\\[\\]:;'<>,./?+=\\-_\\|~0-9A-Za-z ]+$`);

  const name = new RegExp("^[A-Za-z ]+$")

  const handleSubmit =async () =>{
    setCheck(true);
    if(!number.test(data.price) || !number.test(data.stock) ||  !name.test(data.sellerName)){
      setCheck(false)
      return triggerNotification('Invalid Input Details !','error')
    }
    if(image.length === 0){
      setCheck(false)
     return triggerNotification("Minimum 1 Image Required",'info')
    }
    if(image.length > 5){
      setCheck(false)
      return triggerNotification("Maximum Image image limit is 5",'info')
     }
       const formData = new FormData();
       formData.append('product', data.product);
       formData.append('token',token);
       formData.append('price', data.price);
       formData.append('description', data.description);
       formData.append('stock', data.stock);
       formData.append('sellerName', data.sellerName);
       image.forEach((file)=>{
        formData.append('image',file);
       })
     
    await axios.post(`${baseurl}/addproduct`,formData,{headers:{'Content-Type':'multipart/form-data'}}).then((response)=>{
      console.log(response.data)
      const dat = response.data;
      if(dat.success){
        setCheck(false)
       return triggerNotification(dat.msg)
      }
      setCheck(false)
        return   triggerNotification(dat.msg,"error")
    }).catch((err)=>{
      setCheck(false)
console.log(err)
   triggerNotification('Images Size are too large','error')
    }).finally(()=> setCheck(false))
  }
  const [img , setimg] = useState('')
// console.log(image);
const handlepreview =async () =>{
  if (image.length > 0) {
    console.log(image[0])
    const firstImage = image[0];
    const imageUrl = URL.createObjectURL(firstImage);
    console.log('hello',imageUrl)
    setimg(imageUrl);
  }else{
    setimg('https://res.cloudinary.com/dzjvyptwz/image/upload/v1725276771/17252767695041725276769391photo-1523275335684-37898b6baf30.jpeg.jpg');

  }
}


// console.log(img)


  return (
    <div className={styles.container}>

      <SellerNavbar/>
      <div className={styles.addproductcontainer}>
        <div className={styles.addproduct}>
          <div className={styles.addimage}>
          <DropzoneC  onFilesAdded={onImageAdded} onFilesRemove={onFilesRemove}/>

          <p className={styles.inputGroups}>* Choose your first image as Product Thumbnail</p>
          </div>
          <div className={styles.detail}>
      
          <div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faDiceD6}  className={styles.icon} />
          <input
            placeholder="Product Name"
            name="product"
            type="text"
            onChange={(e)=> setData((d)=>{return {...d , product:e.target.value}})}
            required
          />
        </div>
        <div className={styles.inputGroups}>
        <FontAwesomeIcon icon={faTag} className={styles.icon} />
          <input
            placeholder="Product Price"
            name="price"
            type="text"
            onChange={(e)=> setData((d)=>{return {...d , price:e.target.value}})}
            required
          />
        </div><div className={styles.inputGroups}>
        <FontAwesomeIcon icon={faCircleInfo} className={styles.icon} />
          <input
            placeholder="Product Description"
            name="description"
            type="text"
            onChange={(e)=> setData((d)=>{return {...d , description:e.target.value}})}
            required
          />
        </div><div className={styles.inputGroups}>
        <FontAwesomeIcon icon={faBoxesStacked} className={styles.icon} />
          <input
            placeholder="Current Stock"
            name="stock"
            type="text"
            onChange={(e)=> setData((d)=>{return {...d , stock:e.target.value}})}
            required  
          />
        </div><div className={styles.inputGroups}>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />
          <input
            placeholder="Seller Name"
            name="name"
            type="text"
            onChange={(e)=> setData((d)=>{return {...d , sellerName:e.target.value}})}
            required
          />
        </div>
        <button type="button" onClick={handleSubmit} className={styles.submitButtons} disabled={check}>
        Upload Product
        </button>
          </div>
        </div>
        <div className={styles.productlist}>
            <div className={styles.previewheading}><h2>Product Preview</h2></div>
            <div  className={styles.preview}>
                  
               <ProductCard key={'abc'} product={{...data,'image':img}}/>


            </div>
        </div>

      </div>
    </div>
  )
}

export default AddProduct
