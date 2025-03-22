import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '@/services/AuthService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const urlImage = './src/assets/images/categories/'; // Sử dụng đường dẫn hợp lệ

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(); // Gọi API lấy danh sách categories
        setCategories(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="section__content">
      <ul>
        {categories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            ({ _id, name, description, image, parentId, status }) =>
              status === 'active' &&
              parentId === null && (
                <li className="item-categories" key={_id}>
                  <Link className="link-categories" to={`/shop?category=${encodeURIComponent(name)}`}>
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
