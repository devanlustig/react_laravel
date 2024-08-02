import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';
import api from 'src/api/api';
import * as XLSX from 'xlsx';

export default function PostIndex() {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState({ field: 'created_at', order: 'desc' });
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            fetchPosts();
        }
    }, [isLoggedIn]); 

     useEffect(() => {
        setFilteredPosts(allPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [allPosts, currentPage, itemsPerPage]);


    const fetchPosts = async () => {
        try {
            const response = await api.get('/api/posts', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            setAllPosts(response.data.data.data);
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('isLoggedIn');
            navigate('/login');
            console.error('Error fetching posts:', error);
        }
    };

    const handleSort = (field) => {
        const order = sortBy.field === field && sortBy.order === 'asc' ? 'desc' : 'asc';
        setSortBy({ field, order });
        sortPosts(field, order);
    };

    const sortPosts = (field, order) => {
        const sortedPosts = [...filteredPosts];
        sortedPosts.sort((a, b) => {
            if (field === 'title') {
                return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            } else {
                return order === 'asc' ? a.created_at.localeCompare(b.created_at) : b.created_at.localeCompare(a.created_at);
            }
        });
        setFilteredPosts(sortedPosts);
    };

    const searchPosts = (keyword) => {
        const filtered = allPosts.filter(post =>
            post.title.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredPosts(filtered);
    };

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        searchPosts(keyword);
    };

    const deletePost = async (id) => {
        Swal.fire({
            title: 'Anda yakin akan menghapus data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/api/posts/${id}`, { headers: { 'Authorization': `Bearer ${accessToken}` } });
                    fetchPosts();
                    Swal.fire('Terhapus!', 'Data telah dihapus.', 'success');
                } catch (error) {
                    console.error('Error deleting post:', error);
                    Swal.fire('Error!', 'Terjadi kesalahan saat menghapus data.', 'error');
                }
            }
        });
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return 'Actived';
            case 2:
                return 'Inactived';
            case 3:
                return 'Banned';
            default:
                return 'Unknown';
        }
    };

    const exportToExcel = () => {
        const filteredData = filteredPosts.map(({ title, content, status }) => ({ title, content, status: getStatusText(status) }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Posts');
        XLSX.writeFile(workbook, 'posts.xlsx');
    };

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Link to="/posts/create" className="btn btn-md btn-success rounded shadow border-0 mb-3">ADD NEW POST</Link>
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
                                        <th scope="col">Content</th>
                                        <th scopre="col"> Status </th>
                                        <th scope="col" style={{ 'width': '15%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPosts.map((post, index) => (
                                        <tr key={index}>
                                            <td className='text-center'>
                                                <img src={`${api.defaults.baseURL}/storage/posts/${post.image}`} className="rounded" style={{ width: '150px' }} />
                                            </td>
                                            <td>{post.title}</td>
                                            <td>{post.content}</td>
                                            <td>
                                                {   post.status === 1 ? (
                                                    <span className='badge bg-info ms-auto'>Active</span>
                                                    ) : post.status === 2 ? (
                                                        <span className='badge bg-danger ms-auto'>Inactive</span>
                                                    ) : post.status === 3 ? (
                                                        <span className='badge bg-warning ms-auto'>Banned</span>
                                                    )  :
                                                        <span className='badge bg-secondary ms-auto'>Unknown</span>
                                                }
                                            </td>
                                            <td className="text-center">
                                                <Link to={`/posts/edit/${post.id}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 me-2">EDIT</Link>
                                                <button onClick={() => deletePost(post.id)} className="btn btn-sm btn-danger rounded-sm shadow border-0">DELETE</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPosts.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center">Data tidak ditemukan</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <nav aria-label="Page navigation">
                                <ul className="pagination justify-content-center">
                                    {Array.from({ length: Math.ceil(allPosts.length / itemsPerPage) }, (_, index) => (
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
    );
}
