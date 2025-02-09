import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: []
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const { product, quantity } = action.payload;
            const index = state.products.findIndex(item => item.product.id === product.id);
            if (index !== -1) {
                state.products[index].quantity += quantity;
            } else {
                state.products.push({
                    product,
                    quantity
                });
            }
            updateLocalStorage(state.products);
        },
        removeFromCart(state, action) {
            if(state.products[action.payload].quantity > 1) {
                state.products[action.payload].quantity--;
            } else {
                state.products.splice(action.payload, 1);
            }
            updateLocalStorage(state.products);
        },
        emptyCart(state) {
            state.products = [];
            updateLocalStorage(state.products);
        },
        setItems(state, action) {
            state.products = action.payload;
        }
    },
})

const updateLocalStorage = (items) => {
    localStorage.removeItem('items')
    localStorage.setItem('items', JSON.stringify(items))
}   

export const { addToCart, removeFromCart, emptyCart, setItems } = cartSlice.actions

export default cartSlice.reducer;