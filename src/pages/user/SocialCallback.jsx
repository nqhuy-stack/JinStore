import { loginGoogle } from '@services/socialService.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

function SocialCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLoginGoogle = async () => {
      try {
        await loginGoogle(navigate, dispatch);
      } catch {
        toast.error('Tải thông tin người dùng thất bại');
      }
    };
    fetchLoginGoogle();
  }, []);

}

export default SocialCallback;
