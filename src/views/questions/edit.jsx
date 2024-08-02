//import useState
import { useState, useEffect } from 'react';
import { CFormSelect, CFormTextarea, CFormLabel, CRow } from '@coreui/react';

//import useNavigate
import { useNavigate, useParams } from 'react-router-dom';

//import API
import api from 'src/api/api';
import Swal from 'sweetalert2';

export default function QuestionEdit() {

    //define state
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');

    //state validation
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    //useNavigate
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchDetailQuestion = async () => {
        try {
            const response = await api.get(`/api/questions/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setTitle(response.data.data.title);
            setQuestion(response.data.data.question);
            setImage(response.data.data.image);
        } catch (error) {
            console.log(error);
        }
    }


    //hook useEffect
    useEffect(() => {
        
        fetchDetailQuestion();

    }, []);

   
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    const updateQuestion = async (e) => {
        e.preventDefault();
        //init FormData
        const formData = new FormData();

        //append data
        formData.append('image', image);
        formData.append('title', title);
        formData.append('question', question);
        formData.append('_method', 'PUT')

        try {
            // Send data with API
            await api.post(`/api/questions/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            navigate('/questions');

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
                            <form onSubmit={updateQuestion}>
                            
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Image</label>

                                     <img src={`${api.defaults.baseURL}/storage/questions/${image}`} className="rounded" style={{ width: '150px' }} />

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
                                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"/>
                                    {
                                        errors.title && (
                                            <div className="alert alert-danger mt-2">
                                                {errors.title[0]}
                                            </div>
                                        )
                                    }
                                </div>


                               

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Question</label>
                                    <textarea className="form-control" value={question} onChange={(e) => setQuestion(e.target.value)} rows="5" placeholder="Question"></textarea>
                                    {
                                        errors.question && (
                                            <div className="alert alert-danger mt-2">
                                                {errors.question[0]}
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