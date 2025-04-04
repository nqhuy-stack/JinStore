import Home from '@pages/user/Home.jsx';
import Login from '@pages/user/Login.jsx';
import Register from '@pages/user/Register.jsx';
import About from '@pages/user/About.jsx';
import Contact from '@pages/user/Contact.jsx';
import NotFound from '@pages/user/NotFound.jsx';
// import Shop from '@pages/user/Shop';
// import Cart from '@pages/user/Cart';
// import Wishlist from '@pages/user/Wishlist';
// import ProductList from '@/pages/user/ProductList';
// import ProductDetails from '@/pages/user/ProductDetails';
import Admin from '@pages/admin/Admin';
import Dashboard from '@pages/admin/Dashboard';
import Products from '@pages/admin/Products';
import AddProduct from '@pages/admin/AddProduct';
import EditProduct from '@pages/admin/EditProduct';
import Orders from '@pages/admin/Orders';
import OrdersDetail from '@pages/admin/OrdersDetail';
import Users from '@pages/admin/Users';
import Categories from '@pages/admin/Categories';
import ProductReviews from '@pages/admin/ProductReviews';
import AddCategory from '@/pages/admin/AddCategory';

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
      { path: 'categories/add', page: AddCategory },
      { path: 'users', page: Users },
    ],
  },
];

export default routes;
// import Home from '@pages/user/Home';
// import Contact from '@pages/user/Contact';
// import Login from '@pages/user/Login';
// import Register from '@pages/user/Register';
// import NotFound from '@pages/user/NotFound';
// import Shop from '@pages/user/Shop';
// import Cart from '@pages/user/Cart';
// import Wishlist from '@pages/user/Wishlist';
// import AdminLayout from '@pages/admin/AdminLayout';
// import Dashboard from '@pages/admin/Dashboard';
// import Products from '@pages/admin/Products';
// import AddProduct from '@pages/admin/AddProduct';
// import EditProduct from '@pages/admin/EditProduct';
// import Orders from '@pages/admin/Orders';
// import OrdersDetail from '@pages/admin/OrdersDetail';
// import Users from '@pages/admin/Users';
// import Categories from '@pages/admin/Categories';
// import ProductReviews from '@pages/admin/ProductReviews';
// import ProductList from '@/pages/user/ProductList';
// import AddCategory from '@/pages/admin/AddCategory';
// import ProductDetails from '@/pages/user/ProductDetails';

// const routes = [
//   { path: '/', page: Home },
//   { path: '/login', page: Login },
//   { path: '/register', page: Register },
//   { path: '/contact', page: Contact },
//   { path: '/login', page: Login, isPublic: true },
//   { path: '/register', page: Register, isPublic: true },
//   { path: '/shop', page: Shop },
//   { path: '/cart', page: Cart },
//   { path: '/wishlist', page: Wishlist },
//   { path: '/product', page: ProductList },
//   { path: '/product/:id', page: ProductDetails },
//   {
//     path: '/admin',
//     page: AdminLayout,
//     isProtected: true,
//     role: 'Admin',
//     children: [
//       { path: '', page: Dashboard },
//       { path: 'products', page: Products },
//       { path: 'products/add', page: AddProduct },
//       { path: 'products/edit/:id', page: EditProduct },
//       { path: 'product-reviews', page: ProductReviews },

//       { path: 'orders', page: Orders },
//       { path: 'orders/:id', page: OrdersDetail },

//       { path: 'categories', page: Categories },
//       { path: 'categories/add', page: AddCategory },

//       { path: 'users', page: Users },
//     ],
//   },
//   { path: '*', page: NotFound },
// ];

// export default routes;

// import Home from '@pages/user/Home.jsx';
// import Login from '@pages/user/Login.jsx';
// import Register from '@pages/user/Register.jsx';
// import About from '@pages/user/About.jsx';
// import Contact from '@pages/user/Contact.jsx';
// import NotFound from '@pages/user/NotFound.jsx';
// import Shop from '@pages/user/Shop';
// import Cart from '@pages/user/Cart';
// import Wishlist from '@pages/user/Wishlist';
// import ProductList from '@/pages/user/ProductList';
// import ProductDetails from '@/pages/user/ProductDetails';
// import AdminLayout from '@pages/admin/AdminLayout';
// import Dashboard from '@pages/admin/Dashboard';
// import Products from '@pages/admin/Products';
// import AddProduct from '@pages/admin/AddProduct';
// import EditProduct from '@pages/admin/EditProduct';
// import Orders from '@pages/admin/Orders';
// import OrdersDetail from '@pages/admin/OrdersDetail';
// import Users from '@pages/admin/Users';
// import Categories from '@pages/admin/Categories';
// import ProductReviews from '@pages/admin/ProductReviews';
// import AddCategory from '@/pages/admin/AddCategory';

// const routes = [
//   { path: '/', page: Home },
//   { path: '/login', page: Login, isPublic: true },
//   { path: '/register', page: Register, isPublic: true },
//   { path: '/about', page: About },
//   { path: '/contact', page: Contact },
//   { path: '/shop', page: Shop },
//   { path: '/cart', page: Cart },
//   { path: '/wishlist', page: Wishlist },
//   { path: '/product', page: ProductList },
//   { path: '/product/:id', page: ProductDetails },
//   {
//     path: '/admin',
//     page: AdminLayout,
//     isProtected: true,
//     allowedRoles: ['Admin'], // Thay 'role' thành 'allowedRoles' để đồng bộ với App.jsx
//     children: [
//       { path: '', page: Dashboard },
//       { path: 'products', page: Products },
//       { path: 'products/add', page: AddProduct },
//       { path: 'products/edit/:id', page: EditProduct },
//       { path: 'product-reviews', page: ProductReviews },
//       { path: 'orders', page: Orders },
//       { path: 'orders/:id', page: OrdersDetail },
//       { path: 'categories', page: Categories },
//       { path: 'categories/add', page: AddCategory },
//       { path: 'users', page: Users },
//     ],
//   },
//   { path: '/notfound', page: NotFound },
//   { path: '*', page: NotFound }, // Bắt tất cả các đường dẫn không khớp
// ];

// export default routes;
