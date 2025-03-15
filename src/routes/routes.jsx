import Home from '@pages/user/Home.jsx';
import Login from '@pages/user/Login.jsx';
import Register from '@pages/user/Register.jsx';
import About from '@pages/user/About.jsx';
import Contact from '@pages/user/Contact.jsx';
import NotFound from '@pages/user/NotFound.jsx';
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
    path: '/notfound',
    page: NotFound,
  },
  {
    path: '*', // Bắt tất cả các đường dẫn không khớp
    page: NotFound,
  },
];

export default routes;
