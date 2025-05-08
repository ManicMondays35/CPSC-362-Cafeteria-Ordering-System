import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from "../Checkout-Page/CartContext";
import axios from 'axios'; // make sure axios is installed

const PageBackground = styled.div`
  background-image: url("https://images.unsplash.com/photo-1730780883153-b3c046b001c1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding: 40px;
`;

const MenuLayout = styled.div`
    display: flex;
    gap: 20px;
    padding: 20px;
`;

const ItemContainer = styled.div`
    flex: 1;
    background-color: #f1f1f1;
    padding: 20px;
    border-radius: 12px;
    height: 600px;
    overflow-y: auto;
`;

const ItemCard = styled.div`
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 15px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const ItemImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
`;

const MenuButton = styled.button`
    padding: 10px;
    background-color: #800080;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 5px;

    &:hover {
        background-color: rgb(83, 0, 83);
    }
`;

const ButtonBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
`;

const Menu = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [foodItems, setFoodItems] = useState([]);
    const [drinkItems, setDrinkItems] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:4000/menu", {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) throw new Error("Failed to fetch menu");
    
                const data = await response.json();
    
                setFoodItems(data.filter(item => item.category === "food"));
                setDrinkItems(data.filter(item => item.category === "drink"));
            } catch (error) {
                console.error("Error fetching menu:", error);
            } finally {
                setLoading(false); // ✅ MAKE SURE TO SET LOADING TO FALSE
            }
        };
    
        fetchMenu();
    }, []);
    

    const handleCheckoutClick = () => navigate('/checkout');
    const handleBackClick = () => navigate('/home');

    if (loading) return <PageBackground><p>Loading menu...</p></PageBackground>;

    return (
        <PageBackground>
            <MenuLayout>
                <ItemContainer>
                    <h2>Food Items</h2>
                    {foodItems.map(item => (
                        <ItemCard key={item._id}>
                            <ItemImage src={item.image} alt={item.name} />
                            <h4>{item.name}</h4>
                            <p>${item.price.toFixed(2)}</p>
                            <MenuButton onClick={() => addToCart(item)}>Add to Cart</MenuButton>
                        </ItemCard>
                    ))}
                </ItemContainer>

                <ItemContainer>
                    <h2>Drink Items</h2>
                    {drinkItems.map(item => (
                        <ItemCard key={item._id}>
                            <ItemImage src={item.image} alt={item.name} />
                            <h4>{item.name}</h4>
                            <p>${item.price.toFixed(2)}</p>
                            <MenuButton onClick={() => addToCart(item)}>Add to Cart</MenuButton>
                        </ItemCard>
                    ))}
                </ItemContainer>
            </MenuLayout>
            <ButtonBox>
                <MenuButton onClick={handleBackClick}>Back</MenuButton>
                <MenuButton onClick={handleCheckoutClick}>Checkout</MenuButton>
            </ButtonBox>
        </PageBackground>
    );
};

export default Menu;
