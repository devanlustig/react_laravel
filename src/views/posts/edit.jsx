//import useState
import { useState, useEffect } from 'react';
import { CFormSelect, CFormTextarea, CFormLabel, CRow } from '@coreui/react';

//import useNavigate
import { useNavigate, useParams } from 'react-router-dom';

//import API
import api from 'src/api/api';
import Swal from 'sweetalert2';

export default function PostEdit() {

    //define state
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');

    //state validation
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    //useNavigate
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchDetailPost = async () => {
        try {
            const response = await api.get(`/api/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setTitle(response.data.data.title);
            setContent(response.data.data.content);
            setStatus(response.data.data.status);
            setImage(response.data.data.image);
        } catch (error) {
            console.log(error);
        }
    }


    //hook useEffect
    useEffect(() => {
        
        //call method "fetchDetailPost"
        fetchDetailPost();

    }, []);

    //method handle file change
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    //method update post
    const updatePost = async (e) => {
        e.preventDefault();
        //init FormData
        const formData = new FormData();

        //append data
        formData.append('image', image);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('_method', 'PUT')

        try {
            // Send data with API
            await api.post(`/api/posts/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            navigate('/posts');

             Swal.fire(
            'Berhasil!',
            'Data berhasil diperbarui.',
            'success'
            );

        } catch (error) {
            console.log(error);
            // Set errors response to state "errors"
            setErrors(error.response.data);
        }
    }


    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <form onSubmit={updatePost}>
                            
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Image</label>

                                     <img src={`${api.defaults.baseURL}/storage/posts/${image}`} className="rounded" style={{ width: '150px' }} />

                                    <input type="file" onChange={handleFileChange} className="form-control"/>
                                    {
                                        errors.image && (
                                            <div className="alert alert-danger mt-2">
                                                {errors.image[0]}
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Title</label>
                                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title Post"/>
                                    {
                                        errors.title && (
                                            <div className="alert alert-danger mt-2">
                                                {errors.title[0]}
                                            </div>
                                        )
                                    }
                                </div>


                                 <div className="mb-3">
                                   <label className="form-label fw-bold" htmlFor="Status">Status</label>
                                      <select className="form-select" aria-label="Default select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="1">Actived</option>
                                        <option value="2">Inactived</option>
                                        <option value="3">Banned</option>
                                    </select>

                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Content</label>
                                    <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} rows="5" placeholder="Content Post"></textarea>
                                    {
                                        errors.content && (
                                            <div className="alert alert-danger mt-2">
                                                {errors.content[0]}
                                            </div>
                                        )
                                    }
                                </div>

                                <button type="submit" className="btn btn-md btn-primary rounded-sm shadow border-0">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}