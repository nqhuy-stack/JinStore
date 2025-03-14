import Home from '@pages/user/Home';
import Login from '@pages/user/Login';
import Register from '@pages/user/Register';
import About from '@pages/user/About';
import Contact from '@pages/user/Contact';
import NotFound from '@pages/user/NotFound';
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
