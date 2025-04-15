import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesAll } from '@/services/CategoryService.jsx';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategoriesAll();
        setCategories(data);
      } catch (error) {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
        console.error('Lỗi khi lấy danh mục:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <nav className="section__content section__home-cate">
      <ul>
        {categories.map(
          ({ _id, name, description, image, slug, status }) =>
            status === 'active' && (
              <li className="item-categories" key={_id}>
                <Link className="link-categories" to={`/Product?category=${encodeURIComponent(slug)}`}>
                  <img
                    src={image?.url || '/placeholder-image.jpg'}
                    alt={`${name} : ${description}`}
                    className="category-image"
                  />
                  <span>{name}</span>
                </Link>
              </li>
            ),
        )}
      </ul>
    </nav>
  );
};

export default CategoryList;
