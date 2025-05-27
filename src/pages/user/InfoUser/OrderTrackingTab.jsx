import { memo, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getOrdersStatus, getOrdersByIdStatus } from '../../../services/orderService';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '@/redux/authSlice.jsx';
import { createAxios } from '@utils/createInstance.jsx';
import OrderItem from '../../../components/common/ui/OrderItem';
import HeaderStatusOrder from '../../../components/common/ui/HeaderStatusOrder';
import PageLoad from '@pages/PageLoad';

import cartEmpty from '@assets/icons/cart-empty.svg';

const STATUS_MAP = {
  all: 'Tất cả',
  pending: 'Chờ xác nhận',
  paid: 'Đã thanh toán',
  processing: 'Đang chuẩn bị hàng',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
};

const STATUS_ENTRIES = Object.entries(STATUS_MAP);

const OrderTrackingTab = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [searchParams] = useSearchParams();

  // States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs for cleanup
  const abortControllerRef = useRef(null);

  // Memoized values
  const activeTab = useMemo(() => {
    return searchParams.get('status') || 'pending';
  }, [searchParams]);

  const { accessToken, axiosJWT } = useMemo(() => {
    if (!user) return { accessToken: null, axiosJWT: null };

    return {
      accessToken: user.accessToken,
      axiosJWT: createAxios(user, dispatch, loginSuccess),
    };
  }, [user, dispatch]);

  // Memoized navigation handler
  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  // Tab navigation handler
  const handleTabClick = useCallback(
    (status) => {
      const basePath = id ? '' : '/info-user';
      navigate(`${basePath}?tab=orders&status=${status}`);
    },
    [id, navigate],
  );

  // Fetch orders function
  const fetchOrdersStatus = useCallback(
    async (status) => {
      if (!user || !accessToken) {
        setOrders([]);
        return;
      }

      //   previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        let response;
        const signal = abortControllerRef.current.signal;

        if (id) {
          response = await getOrdersByIdStatus(id, status, accessToken, axiosJWT, signal);
        } else {
          response = await getOrdersStatus(status, accessToken, axiosJWT, signal);
        }

        if (response.success) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        // Don't set error if request was aborted
        if (error.name !== 'AbortError') {
          console.error('Error fetching orders status:', error);
          setError(error.message);
          setOrders([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [user, accessToken, axiosJWT, id],
  );

  // Effect to fetch orders
  useEffect(() => {
    fetchOrdersStatus(activeTab);

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOrdersStatus, activeTab]);

  return (
    <div className="profile__tab profile__tab-order">
      <div className="profile__tab-header">
        <HeaderStatusOrder activeTab={activeTab} handleTabClick={handleTabClick} STATUS_ENTRIES={STATUS_ENTRIES} />
      </div>
      <div className="profile__tab-bod">
        {orders.length > 0 ? (
          orders.map((item) => <OrderItem key={item._id || item.id} item={item} onNavigate={handleNavigate} />)
        ) : (
          <img className="img__empty" src={cartEmpty} alt="Cart Empty" />
        )}
      </div>
    </div>
  );
};

export default memo(OrderTrackingTab);
