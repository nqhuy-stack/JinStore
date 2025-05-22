import { useEffect, useState, memo } from 'react';
import Button from '@components/common/utils/Button';
import {
  getAddresses,
  addAddress,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
  getAddressesByUserId,
} from '../../../services/AddressService';
import { createAxios } from '../../../utils/createInstance';
import { loginSuccess } from '../../../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import PageLoad from '../../PageLoad';
import { useParams } from 'react-router-dom';

import FormAddress from '@components/common/forms/FormAddress';

function AddressTab({ selectedDefault = null }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [showFormAddress, setShowFormAddress] = useState(false);
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
      setLoading(true);
      if (id) {
        const response = await getAddressesByUserId(id, accessToken, axiosJWT);
        if (response) {
          setAddresses(response);
          console.log('Addresses loaded:', response);
        }
      } else {
        const response = await getAddresses(accessToken, axiosJWT);
        console.log();
        if (response) {
          setAddresses(response);
          selectedDefault(response.filter((address) => address.isDefault === true));
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowFormAddress(true);
  };

  const handleCloseModal = () => {
    setShowFormAddress(false);
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

      setShowFormAddress(true);
    }
  };

  return (
    <div className="profile__tab profile__tab-address">
      <div className="profile__tab-header">
        <h2 className="header__title">Địa chỉ người dùng</h2>
        {id ? (
          <></>
        ) : (
          <Button type="button" className="btn btn-add" onClick={handleOpenModal}>
            Thêm địa chỉ mới
          </Button>
        )}
      </div>

      {loading ? (
        <PageLoad zIndex={10} />
      ) : (
        addresses &&
        addresses.length > 0 &&
        addresses.map((address) => (
          <div className={`contact-card ${address.isDefault ? 'default' : ''}`} key={address._id}>
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
      )}

      {showFormAddress && (
        <div className="modal-overlay">
          <div className="address-modal-content">
            <div className="modal-header">
              <h2>Thêm địa chỉ mới</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <FormAddress
              formData={formData}
              handleSubmit={handleSubmit}
              handleCloseModal={handleCloseModal}
              handleInputChange={handleInputChange}
              handleSelectProvince={handleSelectProvince}
              handleSelectCity={handleSelectCity}
              handleSelectWard={handleSelectWard}
              provinces={provinces}
              districts={districts}
              wards={wards}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AddressTab);
