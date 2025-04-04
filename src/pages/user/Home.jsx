import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import Button from '@components/ui/Button';
import { getCategories } from '@/services/CategoryService';
import ReusableSection from '@components/ui/ReusableSection.jsx';
import CategoryList from '@components/ui/category/CateList.jsx';
import ProductsCategoryList from '@/components/ui/products/ProdCateList.jsx';

import fullBanner from '@assets/images/banner/full-banner.png';
import moveRight from '@assets/icons/icon-move-right.svg';

function Home() {
  const [category, setCategory] = useState([]);

  //COMMENT: sang trang mới sẻ tự cộng cuộn lên đầu
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); //NOTE: gọi api category
        setCategory(data);
      } catch (error) {
        console.error('Loi khi lay danh muc:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Fragment>
      <section>
        <div className=" container home">
          <div className="home__banner">
            <img className="img-banner" src={fullBanner} alt="Banner" />
            <div className="banner__content">
              <h5 className="discount">Weekend Discount</h5>
              <h2 className="title">Get the best quality products at the lowest prices</h2>
              <p className="describe">We have prepared special discounts for you on organic breakfast products</p>

              <Link to={'/shop'} className="btn btn-shop">
                <p>Shop Now</p>
                <img src={moveRight} alt="Move Right" />
              </Link>
            </div>
          </div>

          {/* NOTE: danh mục nỗi bật */}
          <ReusableSection title="Browse by Categories" linkTo="shop">
            <CategoryList />
          </ReusableSection>

          <div className="home__cashBack">
            <h1 className="cashBack-title">Get 10% Cashback! Min Order of 300.000</h1>
            <p className="cashBack-subtitle">
              Use code: <span className="code">GROCERY1920</span>
            </p>
          </div>

          {/* NOTE: sản phẩm theo danh mục (nổi bật) */}
          {category.map(
            (category) =>
              category.isOutstanding === true && (
                <ReusableSection title={category.name} key={category._id} linkTo={`shop?category=${category.slug}`}>
                  <ProductsCategoryList idCategory={category._id} />
                </ReusableSection>
              ),
          )}
        </div>
      </section>
    </Fragment>
  );
}

export default Home;
