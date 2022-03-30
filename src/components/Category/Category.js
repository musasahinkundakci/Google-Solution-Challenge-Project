import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as categoryActionCreators from "../../redux/actions/categoryActions"
import AddCategory from './includes/AddCategory'
import axios from 'axios'
const Category = ({ ...props }) => {
    const [clicked, setClicked] = useState(false)
    const [categories, setCategories] = useState([])
    function getCategories() {
        axios({
            method: "GET",
            url: "http://localhost:5000/category",
            withCredentials: true,
            crossDomain: true,
            headers: {
                authorization: props.token
            }
        }).then(categoriesres => { console.log(categoriesres); setCategories(categoriesres.data) });
    }
    useEffect(() => {
        getCategories()
        categoryActionCreators.getCategories(props.token)

    }, [])
    return (
        <div className='px-5 py-5'>
            <div className='my-3'><button onClick={() => setClicked(!clicked)}
                className={clicked ? 'btn btn-danger' : 'btn btn-primary'}>{clicked ? "Formu kapat" : "Startup ekle "}
                {clicked ? <i class="fa-solid fa-minus ms-2"></i> : <i class="fa-solid fa-plus ms-2"></i>}</button></div >
            {clicked ? <AddCategory getCategories={getCategories} /> : ""}


            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Number of team members</th>
                        <th scope='col'>Location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  >
                        <th scope="row"> <p>Sevyap</p></th>
                        <td> <p>With this people can do things they like</p></td>
                        <td> <p>5</p></td>
                        <td> <p>Adana</p></td>
                    </tr>

                </tbody>
            </table>
        </div >
    )
}
const mapStateToProps = (state) => {
    return {
        categories: state.categoriesReducer,
        token: state.tokenReducer,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            getCategories: bindActionCreators(categoryActionCreators.getCategories, dispatch)
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Category)