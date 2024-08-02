import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'src/api/api';
import { CDropdownItem } from '@coreui/react';
import { cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react'

const Logout = () => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const logoutPage = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return (
    <CDropdownItem href="#" onClick={logoutPage}>
      <CIcon icon={cilAccountLogout} className="me-2" />
      Logout
    </CDropdownItem>
  );
};

export default Logout;
