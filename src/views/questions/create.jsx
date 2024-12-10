//import useState
import { useState } from 'react';

//import useNavigate
import { useNavigate } from 'react-router-dom';
import { CFormCheck } from '@coreui/react'

//import API
import api from 'src/api/api';
import Swal from 'sweetalert2';

export default function QuestionCreate() {

    //define state
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [pilihan1, setPilihan1] = useState(false);
    const [pilihan2, setPilihan2] = useState(false);
    const [pilihan3, setPilihan3] = useState(false);

    //state validation
    const [errors, setErrors] = useState([]);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    //useNavigate
    const navigate = useNavigate();

    //method handle file change
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    //method store question
    const storeQuestion = async (e) => {
        e.preventDefault();
        
        //init FormData
        const formData = new FormData();

        //append data
        formData.append('image', image);
        formData.append('title', title);
        formData.append('question', question);
        const pilihan = [];
        if (pilihan1) pilihan.push(1);
        if (pilihan2) pilihan.push(2);
        if (pilihan3) pilihan.push(3);
        const pilihanString = pilihan.join(',');
        formData.append('pilihan', pilihanString);

        // Send data with API
        try {
          const response = await api.post('/api/questions', formData, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          setErrors([]);
          navigate('/questions');

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

                            <form onSubmit={storeQuestion}>
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
                                    <input type="text" className="form-control" onChange={(e) => setTitle(e.target.value)} placeholder="Title" required/>
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
                                    <textarea className="form-control" onChange={(e) => setQuestion(e.target.value)} rows="5" placeholder="Question"></textarea>
                                    {
                                        errors.question && (
                                            <div className="alert alert-danger mt-2">
                                                {errors.question[0]}
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Pilihan</label>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check d-inline-block me-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="checkbox1"
                                            checked={pilihan1}
                                            onChange={(e) => setPilihan1(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="checkbox1">
                                            Ice Cream
                                        </label>
                                    </div>

                                    <div className="form-check d-inline-block me-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="checkbox2"
                                            name="pilihan2"
                                            checked={pilihan2}
                                            onChange={(e) => setPilihan2(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="checkbox2">
                                            Milk
                                        </label>
                                    </div>

                                    <div className="form-check d-inline-block me-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="checkbox3"
                                            name="pilihan3"
                                            checked={pilihan3}
                                            onChange={(e) => setPilihan3(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="checkbox3">
                                            Candy
                                        </label>
                                    </div>

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