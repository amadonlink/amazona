import { orderTypes } from '../../constants/order-types';

export const orderCreateReducer = (state = {}, action) => {
    switch(action.type){
        case orderTypes.ORDER_CREATE_REQUEST:
            return{
                loading: true
            };
        case orderTypes.ORDER_CREATE_SUCCESS:
            return{
                loading: false,
                success: true,
                order: action.payload
            };
        case orderTypes.ORDER_CREATE_FAIL:
            return{
                loading: false,
                error: action.payload
            };
        case orderTypes.ORDER_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const orderDetailsReducer = (state = {loading: true}, action) => {
    switch(action.type){
        case orderTypes.ORDER_DETAILS_REQUEST:
            return{
                loading: true
            }
        case orderTypes.ORDER_DETAILS_SECCESS:
            return{
                loading: false,
                order: action.payload,
            }
        case orderTypes.ORDER_DETAILS_FAIL:
            return{
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};

export const orderPayReducer = (state = {}, action) => {
    switch(action.type){
        case orderTypes.ORDER_PAY_REQUEST:
            return{
                loading: true
            }
        case orderTypes.ORDER_PAY_SUCCESS:
            return{
                loading: false,
                success: true
            };
        case orderTypes.ORDER_PAY_FAIL:
            return{
                loading: false,
                error: action.payload
            };
        case orderTypes.ORDER_PAY_RESET:
            return {};
        default:
            return state;
    }
};

export const orderMineListReducer = (state = {orders: []}, action) =>{
    switch(action.type){
        case orderTypes.ORDER_MINE_LIST_REQUEST:
            return{
                loading: true
            };
        case orderTypes.ORDER_MINE_LIST_SUCCESS:
            return{
                loading: false,
                orders: action.payload
            };
        case orderTypes.ORDER_MINE_LIST_FAIL:
            return{
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};