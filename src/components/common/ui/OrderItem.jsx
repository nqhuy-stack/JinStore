import { memo } from 'react';
import useOrderItem from '@hooks/useOrderItem';

const OrderItem = ({ item, onNavigate }) => {
  const {
    orderDate,
    statusText,
    paymentText,
    reviewButtonText,
    refundButtonText,
    showRefundButton,
    handleReviewClick,
    handleRefundClick,
    handleDetailClick,
  } = useOrderItem({ item, onNavigate });

  return (
    <div className="order-tracking">
      <div className="order__info">
        <span className="info__date">Ngày đặt hàng: {orderDate}</span>
        <span className="info__status">{statusText}</span>
      </div>

      <div className="order__items">
        {item.orderItems.map((orderItem) => (
          <div key={orderItem._id || orderItem.id} className="order__item">
            <div className="item__image">
              <img
                src={
                  (orderItem._idProduct.images &&
                    orderItem._idProduct.images[0] &&
                    orderItem._idProduct.images[0].url) ||
                  ''
                }
                alt={orderItem.name}
                loading="lazy"
              />
            </div>
            <div className="item__details">
              <span className="item__name">{orderItem.name}</span>
              <div className="item__info">
                <span className="item__quantity">Số lượng: {orderItem.quantity}</span>
              </div>
            </div>
            <span className="item__total">Đơn giá: {orderItem.price?.toLocaleString()}đ</span>
          </div>
        ))}
      </div>

      <div className="order__info">
        <span className="info__payment-method">{paymentText}</span>
        <span className="info__total">Thành tiền: {item.totalAmount?.toLocaleString()}đ</span>
      </div>

      <div className="order__actions">
        <button
          className="btn btn__action-order btn-review__order"
          onClick={handleReviewClick}
          disabled={item.status !== 'delivered' && item.status !== 'received'}
        >
          {reviewButtonText}
        </button>

        {showRefundButton && (
          <button className="btn btn__action-order btn-cancelled__order" onClick={handleRefundClick}>
            {refundButtonText}
          </button>
        )}

        <button className="btn btn__action-order btn-detail__order" onClick={handleDetailClick}>
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export default memo(OrderItem);
