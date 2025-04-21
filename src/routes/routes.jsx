import Home from '@pages/user/Home.jsx';
import Login from '@pages/user/Login.jsx';
import SocialCallback from '@pages/user/SocialCallback';
import Register from '@pages/user/Register.jsx';
import About from '@pages/user/About.jsx';
import Contact from '@pages/user/Contact.jsx';
import NotFound from '@pages/user/NotFound.jsx';
// import Shop from '@pages/user/Shop';
import Cart from '@pages/user/Cart';
import Checkout from '@pages/user/Checkout';
import Wishlist from '@pages/user/Wishlist';
import ProductList from '@pages/user/ProductList';
import ProductDetails from '@pages/user/ProductDetails';

import Products from '@pages/admin/products/Products';
import AddProduct from '@pages/admin/products/AddProduct';
import EditProduct from '@pages/admin/products/EditProduct';
import ProductReviews from '@pages/admin/products/ProductReviews';

import Admin from '@pages/admin/Admin';
import Users from '@pages/admin/Users';
import Dashboard from '@pages/admin/Dashboard';

import Orders from '@pages/admin/orders/Orders';
import OrdersDetail from '@pages/admin/orders/OrdersDetail';

import Categories from '@pages/admin/categories/Categories';
import CategoryForm from '@/pages/admin/categories/CategoryForm';
import AddCategory from '@/pages/admin/categories/AddCategory';
import EditCategory from '@/pages/admin/categories/EditCategory';
const routes = [
  {
    path: '/',
    page: Home,
  },
  {
    path: '/login',
    page: Login,
  },
  {
    path: '/login-google/success',
    page: SocialCallback,
  },
  {
    path: '/register',
    page: Register,
  },
  {
    path: '/about',
    page: About,
  },
  {
    path: '/contact',
    page: Contact,
  },
  {
    path: '*', // Bắt tất cả các đường dẫn không khớp
    page: NotFound,
  },
  {
    path: '/product',
    page: ProductList,
  },
  {
    path: '/product/:id',
    page: ProductDetails,
  },
  {
    path: '/cart',
    page: Cart,
  },
  {
    path: '/checkout',
    page: Checkout,
  },
  {
    path: '/wishlist',
    page: Wishlist,
  },
  {
    path: '/admin',
    page: Admin,
    isProtected: true,
    adminOnly: true,
    children: [
      { path: '', page: Dashboard },
      { path: 'products', page: Products },
      { path: 'products/add', page: AddProduct },
      { path: 'products/edit/:id', page: EditProduct },
      { path: 'product-reviews', page: ProductReviews },
      { path: 'orders', page: Orders },
      { path: 'orders/:id', page: OrdersDetail },
      { path: 'categories', page: Categories },
      { path: 'categories/form', page: CategoryForm },
      { path: 'categories/form/:id', page: CategoryForm },
      { path: 'users', page: Users },
    ],
  },
];

export default routes;
