import { useEffect, useState } from 'react';
import Button from '@components/common/Button';
import {
  getAddresses,
  addAddress,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
} from '../../../services/AddressService';
import { createAxios } from '../../../utils/createInstance';
import { loginSuccess } from '../../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function AddressTab() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // State cho dữ liệu địa chỉ hành chính
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    detailed: '',
    district: '',
    city: '',
    province: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
    fetchProvinces();
  }, []);

  // Lấy danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://provinces.open-api.vn/api/p/');
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố đã chọn
  const fetchDistricts = async (provinceCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      setDistricts(response.data.districts);
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
  const fetchWards = async (districtCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(response.data.wards);
    } catch (error) {
      console.error('Error fetching wards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses(accessToken, axiosJWT);
      if (response) {
        setAddresses(response);
        console.log('Addresses loaded:', response);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleOpenModal = () => {
    setShowAddressModal(true);
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
    // Reset form
    setFormData({
      detailed: '',
      district: '',
      city: '',
      province: '',
      isDefault: false,
    });
    // Reset quận/huyện và phường/xã
    setDistricts([]);
    setWards([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSelectProvince = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const provinceCode = selectedOption.getAttribute('data-code');
    const provinceName = e.target.value;

    setFormData({
      ...formData,
      province: provinceName,
      city: '',
      district: '',
    });

    if (provinceCode) {
      fetchDistricts(provinceCode);
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  const handleSelectCity = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const districtCode = selectedOption.getAttribute('data-code');
    const districtName = e.target.value;

    setFormData({
      ...formData,
      city: districtName,
      district: '',
    });

    if (districtCode) {
      fetchWards(districtCode);
    } else {
      setWards([]);
    }
  };

  const handleSelectWard = (e) => {
    const wardName = e.target.value;

    setFormData({
      ...formData,
      district: wardName,
    });
  };

  // Thêm địa chỉ mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.detailed || !formData.district || !formData.city || !formData.province) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, formData, accessToken, axiosJWT);
      } else {
        await addAddress(formData, accessToken, axiosJWT, dispatch);
      }
      fetchAddresses();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        await deleteAddress(id, accessToken, axiosJWT);
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id, accessToken, axiosJWT);
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleUpdate = (id) => {
    const addressToUpdate = addresses.find((address) => address._id === id);
    setEditingAddressId(id);
    if (addressToUpdate) {
      setFormData({
        detailed: addressToUpdate.detailed || '',
        district: addressToUpdate.district || '',
        city: addressToUpdate.city || '',
        province: addressToUpdate.province || '',
        isDefault: addressToUpdate.isDefault || false,
      });

      // Cần fetch districts và wards dựa trên province và city đã chọn
      // Đây là chức năng phức tạp hơn vì chúng ta cần tìm code dựa trên tên
      const selectedProvince = provinces.find((p) => p.name === addressToUpdate.province);
      if (selectedProvince) {
        fetchDistricts(selectedProvince.code);
      }

      setShowAddressModal(true);
    }
  };

  return (
    <div className="profile__tab profile__tab-address">
      <div className="profile__tab-header">
        <h2 className="header__title">Địa chỉ người dùng</h2>
        <Button type="button" className="btn btn-add" onClick={handleOpenModal}>
          Thêm địa chỉ mới
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        addresses.map((address) => (
          <div className="contact-card" key={address._id}>
            <div className="contact-header">
              <h2 className="contact-name">
                {address._idUser?.fullname} | {address._idUser?.phone}
              </h2>
              <div className="contact-actions">
                <button className="btn-update" onClick={() => handleUpdate(address._id)}>
                  Cập nhật
                </button>
                <button className="btn-delete" onClick={() => handleDelete(address._id)}>
                  Xóa
                </button>
              </div>
            </div>

            <div className="contact-address">
              <p>{address.detailed}</p>
              <p>
                {address.district}, {address.city}, {address.province}
              </p>
            </div>

            <div className="contact-footer">
              {address.isDefault ? (
                <button className="btn-default" disabled>
                  Mặc định
                </button>
              ) : (
                <button className="btn-set-default" onClick={() => handleSetDefault(address._id)}>
                  Thiết lập mặc định
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Không có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
      )}

      {showAddressModal && (
        <div className="address-modal">
          <div className="address-modal-content">
            <div className="modal-header">
              <h2>Thêm địa chỉ mới</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <form className="block__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="detailed">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  id="detailed"
                  name="detailed"
                  value={formData.detailed}
                  onChange={handleInputChange}
                  placeholder="Số nhà, tòa nhà, tên đường..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="province">Tỉnh/Thành phố</label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleSelectProvince}
                  disabled={loading}
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.name} data-code={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="city">Quận/Huyện</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleSelectCity}
                  disabled={!formData.province || loading}
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.name} data-code={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="district">Phường/Xã</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleSelectWard}
                  disabled={!formData.city || loading}
                >
                  <option value="">Chọn Phường/Xã</option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.name}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressTab;
