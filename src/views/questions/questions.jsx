import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';
import { useSelector, useDispatch } from 'react-redux';

import api from 'src/api/api';
import * as XLSX from 'xlsx';

export default function QuestionIndex() {
    const [allQuestions, setAllQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState({ field: 'created_at', order: 'desc' });
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchQuestions();
        }
    }, [isLoggedIn]);


    useEffect(() => {
        setFilteredQuestions(allQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [allQuestions, currentPage, itemsPerPage]);


    useEffect(() => {
        if (!isLoading) {
            Swal.close();
        }
    }, [isLoading]);


    const showLoadingAlert = () => {
      Swal.fire({
          //title: 'Loading...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          html:'<i class="cil-sync"> Loading...</i>',
          didClose: () => {
              setIsLoading(false);
          }
      });
    };


    const fetchQuestions = async () => {
        try {

            //showLoadingAlert();
            const response = await api.get('/api/questions', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            setAllQuestions(response.data.data.data);
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('isLoggedIn');
            navigate('/login');
            console.error('Error fetching Questions:', error);
        } 
        // finally {
        //   setIsLoading(false);
        // }
    };

    const handleSort = (field) => {
        const order = sortBy.field === field && sortBy.order === 'asc' ? 'desc' : 'asc';
        setSortBy({ field, order });
        sortQuestions(field, order);
    };

    const sortQuestions = (field, order) => {
        const sortedQuestions = [...filteredQuestions];
        sortedQuestions.sort((a, b) => {
            if (field === 'title') {
                return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            } else {
                return order === 'asc' ? a.created_at.localeCompare(b.created_at) : b.created_at.localeCompare(a.created_at);
            }
        });
        setFilteredQuestions(sortedQuestions);
    };

    const searchQuestions = (keyword) => {
        const filtered = allQuestions.filter(post =>
            post.title.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredQuestions(filtered);
    };

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        searchQuestions(keyword);
    };

    const deleteQuestion = async (id) => {
        Swal.fire({
            title: 'Anda yakin akan menghapus data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/api/questions/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
                    fetchQuestions();
                    Swal.fire('Terhapus!', 'Data telah dihapus.', 'success');
                } catch (error) {
                    console.error('Error deleting question:', error);
                    Swal.fire('Error!', 'Terjadi kesalahan saat menghapus data.', 'error');
                }
            }
        });
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const exportToExcel = () => {
        const filteredData = filteredQuestions.map(({ title, question }) => ({ title, question }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'questions');
        XLSX.writeFile(workbook, 'questions.xlsx');
    };

    const pilihanLabels = {
        1: 'Ice Cream',
        2: 'Milk',
        3: 'Candy'
    };

    const counter = useSelector((state) => state.dodol);
    const dispatch = useDispatch();

    return (
      //!isLoading && (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                      {/*  <button onClick={() => dispatch({ type: 'INCREMENT' })}> Tambah 1 </button>
                            nilai saat ini : {counter}  */}

                            <Link to="/questions/create" className="btn btn-md btn-success rounded shadow border-0 mb-3">ADD NEW QUESTION</Link>
                            <button onClick={exportToExcel} className="btn btn-md btn-primary rounded-sm shadow border-0 mb-3" style={{ marginLeft:'10px' }}>Export to Excel</button>
                            <input 
                                type="text" 
                                value={searchKeyword} 
                                onChange={handleSearch} 
                                style={{ float: 'right', width: '20%' }} 
                                className="form-control" 
                                placeholder="Search..." 
                            />
                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th scope="col">Image</th>
                                        <th scope="col" onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                                            <a className={'breadcrumb-item'}>Title</a> 
                                            {sortBy.field === 'title' && (
                                                <CIcon icon={sortBy.order === 'asc' ? cilArrowTop : cilArrowBottom} size="lg" />
                                            )}
                                        </th>
                                        <th scope="col">Question</th>
                                        <th scope="col">Pilihan</th>
                                        <th scope="col" style={{ 'width': '15%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQuestions.map((question, index) => (
                                        <tr key={index}>
                                            <td className='text-center'>
                                                <img src={`${api.defaults.baseURL}/storage/questions/${question.image}`} className="rounded" style={{ width: '150px' }} />
                                            </td>
                                            <td>{question.title}</td>
                                            <td>{question.question}</td>
                                            <td>{question.pilihan && question.pilihan.split(',').map((item, idx) => (
                                                <span key={idx} className="badge bg-info me-1">{pilihanLabels[item]}</span>
                                            ))}</td>
                                            <td className="text-center">
                                                <Link to={`/questions/edit/${question.id}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</Link>
                                                <button onClick={() => deleteQuestion(question.id)} className="btn btn-sm btn-danger rounded-sm shadow border-0">DELETE</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredQuestions.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center">Data Kosong</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center">
                                    {Array.from({ length: Math.ceil(allQuestions.length / itemsPerPage) }, (_, index) => (
                                        <li key={index + 1} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                        </div>
                    </div>
                </div>
            </div>
        </div>
      //)
    );
}
