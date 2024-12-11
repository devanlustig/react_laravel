//import useState
import { useState, useEffect } from 'react';
//import useNavigate
import { useNavigate, useParams } from 'react-router-dom';

//import API
import api from 'src/api/api';
import Swal from 'sweetalert2';
import Select from 'react-select';

export default function QuestionEdit() {

    //define state
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [pilihan, setPilihan] = useState([]);
    const [produkList, setProdukList] = useState([]);
    const [selectedProduk, setSelectedProduk] = useState(null);

    //state validation
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    //useNavigate
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchProduk = async () => {
        try {
            const response = await api.get(`/api/getMasterProduk`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data.data)) {
                setProdukList(response.data.data);
            } else {
                console.log("Data received is not an array:", response.data.data);
                setProdukList([]); 
            }

        } catch (error) {
            console.log("Error fetching master produk:", error);
            setProdukList([]);
        }
    };

    const fetchDetailQuestion = async () => {
        try {

            Swal.fire({
                title: 'Loading...',
                text: 'Please wait while we load the data.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await api.get(`/api/getQuestionsProduk/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setTitle(response.data.data.title);
            setQuestion(response.data.data.question);
            setImage(response.data.data.image);
            const pilihanArray = response.data.data.pilihan ? response.data.data.pilihan.split(',').map(Number) : [];
            setPilihan(pilihanArray);
            setSelectedProduk({
                value: response.data.data.produk_id,
                label: response.data.data.nama_produk
            });

            Swal.close();

        } catch (error) {
            console.log(error);
            Swal.close();
        }
    }

    useEffect(() => {
        fetchProduk();
        fetchDetailQuestion();
    }, []);

    useEffect(() => {
    }, [pilihan]);
  
   
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleSelectProduk = (selectedOption) => {
        setSelectedProduk(selectedOption);
    };

    const formattedProdukList = produkList.map(produk => ({
        value: produk.id,
        label: produk.nama_produk,
    }));

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const updatedPilihan = [...pilihan];

        if (checked) {
            updatedPilihan.push(Number(value));
        } else {
            const index = updatedPilihan.indexOf(Number(value));
            if (index > -1) updatedPilihan.splice(index, 1);
        }

        setPilihan(updatedPilihan);
    };

    const updateQuestion = async (e) => {
        e.preventDefault();
        //init FormData
        const formData = new FormData();

        //append data
        formData.append('image', image);
        formData.append('title', title);
        formData.append('question', question);
        const pilihanString = pilihan.length > 0 ? pilihan.join(',') : '';
        formData.append('pilihan', pilihanString);
        formData.append('produk_id', selectedProduk ? selectedProduk.value : '');

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

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Pilihan</label>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check d-inline-block me-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="1"
                                            checked={pilihan.includes(1)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-check-label" htmlFor="checkbox1">
                                            Ice Cream
                                        </label>
                                    </div>

                                    <div className="form-check d-inline-block me-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="2"
                                            checked={pilihan.includes(2)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-check-label" htmlFor="checkbox2">
                                            Milk
                                        </label>
                                    </div>

                                    <div className="form-check d-inline-block me-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="3"
                                            checked={pilihan.includes(3)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label className="form-check-label" htmlFor="checkbox3">
                                            Candy
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Pilih Produk</label>
                                    <Select
                                        options={formattedProdukList}
                                        onChange={handleSelectProduk}
                                        value={selectedProduk}
                                        placeholder="Cari Produk..."
                                        isClearable
                                        isSearchable
                                        noOptionsMessage={() => 'Tidak ada produk ditemukan'}
                                    />
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