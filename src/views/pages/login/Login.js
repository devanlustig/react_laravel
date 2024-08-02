import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import api from 'src/api/api';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cibGmail } from '@coreui/icons'

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

   useEffect(() => {
       
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }); 
  

  const loginPage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      const response = await api.post('/api/login', formData);
      const token  = response.data.token; 
      localStorage.setItem('accessToken', token); 
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } catch (error) {
      if (error.response.data.email) {
        setErrors(error.response.data.email);
      } else if (error.response.data.error) {
        setErrors(error.response.data.error);  
      } else {
        setErrors(error.response.data.message); 
      }
    }
};


  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cibGmail} />
                      </CInputGroupText>
                      <CFormInput 
                      placeholder="Email" 
                      autoComplete="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    {errors && <div className="text-danger mb-3">{errors}</div>}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={loginPage}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
