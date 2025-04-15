import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '@components/common/Breadcrumb';

const Wishlist = () => {
  const [wishlistItems] = useState([
    {
      id: 1,
      name: 'Fresh Bread and Pastry Flour 200 g',
      category: 'Vegetable',
      image: '/images/products/flour.jpg',
      price: 8.02,
      originalPrice: 15.15,
      weight: '250 ml',
    },
    {
      id: 2,
      name: 'Peanut Butter Bite Premium Butter Cookies 600 g',
      category: 'Vegetable',
      image: '/images/products/cookies.jpg',
      price: 4.33,
      originalPrice: 10.36,
      weight: '350 G',
    },
    {
      id: 3,
      name: 'SnackAmor Combo Pack of Jowar Stick and Jowar Chips',
      category: 'Snacks',
      image: '/images/products/chips.jpg',
      price: 12.52,
      originalPrice: 13.62,
      weight: '570 G',
    },
    {
      id: 4,
      name: 'Yumitos Chilli Sprinkled Potato Chips 100 g',
      category: 'Snacks',
      image: '/images/products/potato-chips.jpg',
      price: 10.25,
      originalPrice: 12.36,
      weight: '100 G',
    },
    {
      id: 5,
      name: 'Fantasy Crunchy Choco Chip Cookies',
      category: 'Vegetable',
      image: '/images/products/choco-cookies.jpg',
      price: 14.25,
      originalPrice: 16.57,
      weight: '550 G',
    },
    {
      id: 6,
      name: 'Fresh Bread and Pastry Flour 200 g',
      category: 'Vegetable',
      image: '/images/products/bread.jpg',
      price: 12.68,
      originalPrice: 14.69,
      weight: '1 KG',
    },
  ]);

  const handleRemoveFromWishlist = (id) => {
    // Implement remove from wishlist functionality
    console.log('Remove from wishlist:', id);
  };

  const handleAddToCart = (id) => {
    // Implement add to cart functionality
    console.log('Add to cart:', id);
  };

  return (
    <>
      <Breadcrumb items={[{ text: 'Wishlist' }]} />
      <div className="wishlist">
        <div className="wishlist__container">
          <div className="wishlist__grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist__item">
                <button className="remove-btn" onClick={() => handleRemoveFromWishlist(item.id)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="item__image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="item__category">{item.category}</div>

                <h3 className="item__name">{item.name}</h3>

                <div className="item__weight">{item.weight}</div>

                <div className="item__price">
                  <span className="current-price">${item.price.toFixed(2)}</span>
                  <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                </div>

                <button className="add-btn" onClick={() => handleAddToCart(item.id)}>
                  Add
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
