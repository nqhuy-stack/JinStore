import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '@/services/AuthService.jsx';

const CategoryList = () => {
  const urlImage = './src/assets/images/categories/';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
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
          ({ _id, name, description, image, parentId, slug, status }) =>
            status === 'active' &&
            parentId === null && (
              <li className="item-categories" key={_id}>
                <Link className="link-categories" to={`/shop?category=${encodeURIComponent(slug)}`}>
                  <img src={`${urlImage}${image}`} alt={`${name} : ${description}`} />
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
