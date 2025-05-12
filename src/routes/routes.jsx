import Home from '@pages/user/Home.jsx';
import InfoUser from '@pages/user/InfoUser.jsx';
import Login from '@pages/user/Login.jsx';
import Register from '@pages/user/Register.jsx';
import ResetPassword from '@pages/user/ResetPassword.jsx';
import SocialCallback from '@pages/user/SocialCallback';
import About from '@pages/user/About.jsx';
import Contact from '@pages/user/Contact.jsx';
import NotFound from '@pages/user/NotFound.jsx';

// import Shop from '@pages/user/Shop';
import Cart from '@pages/user/Cart';
import Checkout from '@pages/user/Checkout';
import ProductList from '@pages/user/ProductList';
import ProductDetails from '@pages/user/ProductDetails';

import Admin from '@pages/admin/Admin';
import Users from '@pages/admin/users/Users';
// import AddUser from '@pages/admin/users/AddUser';
import Dashboard from '@pages/admin/Dashboard';

import Orders from '@pages/admin/orders/Orders';
import OrdersDetail from '@pages/admin/orders/OrdersDetail';

import Discount from '@pages/admin/discounts/Discount';
import AddDiscount from '@pages/admin/discounts/AddDiscount';
import EditDiscount from '@pages/admin/discounts/EditDiscount';

import Categories from '@pages/admin/categories/Categories';
// import CategoryForm from '@pages/admin/categories/CategoryForm';
import AddCategory from '@/pages/admin/categories/AddCategory';
import EditCategory from '@/pages/admin/categories/EditCategory';

import Products from '@pages/admin/products/Products';
import AddProduct from '@pages/admin/products/AddProduct';
import EditProduct from '@pages/admin/products/EditProduct';
import ProductReviews from '@pages/admin/products/ProductReviews';

const routes = [
  {
    path: '/',
    page: Home,
  },
  {
    path: '/info-user',
    page: InfoUser,
  },
  {
    path: '/login',
    page: Login,
  },
  {
    path: '/resetPassword',
    page: ResetPassword,
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
    path: '/admin',
    page: Admin,
    isProtected: true,
    adminOnly: true,
    children: [
      { path: '', page: Dashboard },
      { path: 'discounts', page: Discount },
      { path: 'discounts/add', page: AddDiscount },
      { path: 'discounts/edit/:id', page: EditDiscount },
      { path: 'products', page: Products },
      { path: 'products/add', page: AddProduct },
      { path: 'products/edit/:id', page: EditProduct },
      { path: 'product-reviews', page: ProductReviews },
      { path: 'orders', page: Orders },
      { path: 'orders/:id', page: OrdersDetail },
      { path: 'categories', page: Categories },
      { path: 'categories/add', page: AddCategory },
      { path: 'categories/edit/:id', page: EditCategory },
      /*       { path: 'categories/form', page: CategoryForm },
      { path: 'categories/form/:id', page: CategoryForm }, */
      { path: 'users', page: Users },
      // { path: 'users/add', page: AddUser },
    ],
  },
];

export default routes;
