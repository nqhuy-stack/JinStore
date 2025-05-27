import { useCallback, useMemo } from 'react';

function useOrderItem({ item, onNavigate }) {
  const STATUS_MAP = {
    all: 'Tất cả',
    pending: 'Chờ xác nhận',
    paid: 'Đã thanh toán',
    processing: 'Đang chuẩn bị hàng',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
  };
  const handleReviewClick = useCallback(() => {
    onNavigate(`/write-review/${item._id || item.id}`);
  }, [item._id, item.id, onNavigate]);

  const handleRefundClick = useCallback(() => {
    onNavigate(`/info-user?tab=orders&id=${item._id || item.id}`);
  }, [item._id, item.id, onNavigate]);

  const handleDetailClick = useCallback(() => {
    onNavigate(`/order/details/${item._id || item.id}`);
  }, [item._id, item.id, onNavigate]);

  // Memoize computed values
  const orderDate = useMemo(() => {
    return item.createdAt.split('T')[0];
  }, [item.createdAt]);

  const statusText = useMemo(() => {
    return STATUS_MAP[item.status] || item.status;
  }, [item.status, STATUS_MAP]);

  const paymentText = useMemo(() => {
    if (item.paymentMethod === 'cod') {
      return 'Thanh toán khi nhận hàng';
    }
    return item.isPaid === false ? 'Chưa thanh toán' : 'Đã thanh toán';
  }, [item.paymentMethod, item.isPaid]);

  const reviewButtonText = useMemo(() => {
    return item.status === 'delivered' ? 'Đã nhận hàng' : item.status === 'received' ? 'Đánh giá' : 'Đã nhận hàng';
  }, [item.status]);

  const refundButtonText = useMemo(() => {
    return item.isPaid && item.status === 'paid' ? 'Yêu cầu hoàn tiền' : 'Yêu cầu hoàn tiền/ trả hàng';
  }, [item.isPaid, item.status]);

  const showRefundButton = useMemo(() => {
    return (item.isPaid && item.status === 'paid') || item.status === 'received';
  }, [item.isPaid, item.status]);

  return {
    orderDate,
    statusText,
    paymentText,
    reviewButtonText,
    refundButtonText,
    showRefundButton,
    handleReviewClick,
    handleRefundClick,
    handleDetailClick,
  };
}

export default useOrderItem;
