import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../checkout';
import LoadingBox from './../../components/LoadingBox';
import MessageBox from './../../components/MessageBox';
import { detailsOrder, payOrder } from './../../actions/order-actions';
import Axios from 'axios';
import { orderTypes } from '../../constants/order-types';

function OrderScreen(props) {
    const dispatch = useDispatch();
    const orderId = props.match.params.id;
    const [sdkReady, setSdkReady] = useState(false);

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const successPaymentHandler = (paymentResult) => {
      dispatch(
        payOrder(order, paymentResult)
      );
    }

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;

    useEffect(() => {
      const addPayPalScript = async () => {
        const { data } = await Axios.get('/api/config/paypal');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
      if(!order?._id || successPay || (order && order._id !== orderId)){
        dispatch({
          type: orderTypes.ORDER_PAY_RESET,
        })
        dispatch(
          detailsOrder(orderId)
      );
      }else{
        if(!order.isPaid){
          if(!window.paypal){
            addPayPalScript();
          }else{
            setSdkReady(true)
          }
        }
      }
     
    },[dispatch, order, orderId, sdkReady]);

    return loading ? ( <LoadingBox></LoadingBox>) : 
          error ? ( <MessageBox variant='danger'>{error}</MessageBox>)
        :
        (
        <div>
          <div>Order: {order._id}</div>
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        <div className="row top">
          <div className="col-2">
            <ul>
              <li>
                <div className="card card-body">
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                    <strong>Address: </strong> {order.shippingAddress.address},
                     { order.shippingAddress.city}, { order.shippingAddress.postalCode},
                     { order.shippingAddress.country}
                  </p>
                  {
                    order.isDelivered ? (<MessageBox variant='seccess'>Delivered at {order.deliveredAt} </MessageBox>) 
                    : (
                      <MessageBox variant='danger'>Not Delivered</MessageBox>
                    )
                  }
                </div>
              </li>
              <li>
                <div className="card card-body">
                  <h2>Payment</h2>
                  <p>
                    <strong>Method:</strong> {order.paymentMethod}
                  </p>
                  {
                    order.isPaid ? (<MessageBox variant='seccess'>Paid at {order.paidAt} </MessageBox>) 
                    : (
                      <MessageBox variant='danger'>Not Paid</MessageBox>
                    )
                  }
                </div>
              </li>
              <li>
                <div className="card card-body">
                  <h2>Order Items</h2>
                  <ul>
                    {order.orderItems.map((item) => (
                      <li key={item.product}>
                        <div className="row">
                          <div>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="small"
                            ></img>
                          </div>
                          <div className="min-30">
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </div>
  
                          <div>
                            {item.qty} x &#8358;{item.price} = &#8358;{item.qty * item.price}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="col-1">
            <div className="card card-body">
              <ul>
                <li>
                  <h2>Order Summary</h2>
                </li>
                <li>
                  <div className="row">
                    <div>Items</div>
                    <div>&#8358;{order.itemsPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Shipping</div>
                    <div>&#8358;{order.shippingPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>Tax</div>
                    <div>&#8358;{order.taxPrice.toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="row">
                    <div>
                      <strong> Order Total</strong>
                    </div>
                    <div>
                      <strong>&#8358;{order.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </li>
                { !order.isPaid && (
                  <li>
                    {!sdkReady ? (
                      <LoadingBox></LoadingBox>
                    ) :(
                      <>
                      { errorPay && <MessageBox variant='danger'>{errorPay}</MessageBox>}
                      { loadingPay && <LoadingBox></LoadingBox>}

                      <PayPalButton amount={order.totalPrice} 
                         onSuccess={successPaymentHandler}>
                        </PayPalButton>
                      </>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
}

export default OrderScreen;
