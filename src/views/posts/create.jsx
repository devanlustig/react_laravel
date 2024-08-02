//import useState
import { useState } from 'react';

//import useNavigate
import { useNavigate } from 'react-router-dom';

//import API
import api from 'src/api/api';
import Swal from 'sweetalert2';

export default function PostCreate() {

    //define state
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');

    //state validation
    const [errors, setErrors] = useState([]);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    //useNavigate
    const navigate = useNavigate();

    //method handle file change
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    //method store post
    const storePost = async (e) => {
        e.preventDefault();
        
        //init FormData
        const formData = new FormData();

        //append data
        formData.append('image', image);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);

        // Send data with API
        try {
          const response = await api.post('/api/posts', formData, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          setErrors([]);
          navigate('/posts');

           Swal.fire(
            'Berhasil!',
            'Data berhasil ditambahkan.',
            'success'
            );
          

        } catch (error) {
          console.log(error.response.data);
          setErrors(error.response.data);
          let errorMessage = 'Terjadi kesalahan saat menambahkan data.';

          if (error.response.data && error.response.data.image) {
            errorMessage = error.response.data.image[0];
          }

          Swal.fire(
            'Error!',
             errorMessage,
            'error'
            );
        }


    }

    return (
        <div className="container mt-3">
            <div className="row">
            {errors && <div className="text-danger">{errors}</div>}
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">

                            <form onSubmit={storePost}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Image</label>
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
                                    <input type="text" className="form-control" onChange={(e) => setTitle(e.target.value)} placeholder="Title Post" required/>
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
                                      <select className="form-select" onChange={(e) => setStatus(e.target.value)}>
                                        <option value="1">Actived</option>
                                        <option value="2">Inactived</option>
                                        <option value="3">Banned</option>
                                    </select>

                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Content</label>
                                    <textarea className="form-control" onChange={(e) => setContent(e.target.value)} rows="5" placeholder="Content Post"></textarea>
                                    {
                                        errors.content && (
                                            <div className="alert alert-danger mt-2">
                                                {errors.content[0]}
                                            </div>
                                        )
                                    }
                                </div>

                                <button type="submit" className="btn btn-md btn-primary rounded-sm shadow border-0">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}