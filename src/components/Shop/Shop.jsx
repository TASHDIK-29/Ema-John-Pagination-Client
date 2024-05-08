import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {


    const [products, setProducts] = useState([]);
    // const [cart, setCart] = useState([])
    const cart = useLoaderData();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [count, setCount] = useState(0);
    // const { count } = useLoaderData();
    // console.log(count);
    // const count = 76;

    const numberOfPages = Math.ceil(count / itemsPerPage);
    // console.log(numberOfPages);
    const pages = [...Array(numberOfPages).keys()];
    console.log(pages);
    // It can be done by simple for loop

    useEffect( () =>{
        fetch('http://localhost:5000/productCount')
        .then(res => res.json())
        .then(data => setCount(data.count))
    },[])

    // Pagination
    const handelItemsPerPage = e => {
        console.log(e.target.value);
        const val = parseInt(e.target.value);
        setItemsPerPage(val);
        setCurrentPage(0);
    }

    const handelPreviousPage = () =>{
        if(currentPage > 0){
            setCurrentPage(currentPage - 1);
        }
    }
    const handelNextPage = () =>{
        if(currentPage < pages.length - 1){
            setCurrentPage(currentPage + 1);
        }
    }



    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            {/* <p>Current Page : {currentPage}</p> */}
            <div className='pagination'>
                <p>Current Page : {currentPage}</p>
                <div>
                    <button onClick={handelPreviousPage}>Prev</button>
                    {
                        pages.map(i => <button className={currentPage === i ? 'selected' : ''} onClick={() => setCurrentPage(i)} key={i}>{i}</button>)
                    }
                    <button onClick={handelNextPage}>Next</button>
                    <select value={itemsPerPage} onChange={handelItemsPerPage} name="" id="">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

            </div>
        </div>
    );
};

export default Shop;