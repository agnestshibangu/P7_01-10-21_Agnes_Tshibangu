import React, {  useEffect, useCallback, useState, useContext } from 'react';
import Axios from "axios";
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import '../forum.css'
import DropdownDelMod from '../components/DropdownDelMod'
import Modal from '../components/Modal'
import DataContext from '../DataContext'
import { useHistory } from "react-router-dom";



export default function Forum() {

    const history = useHistory(); 

    const { dataUser, LStoken } = useContext(DataContext)
     const [title, setTitle] = useState('');
     const [content, setContent] = useState('');
     const [posts, setPosts] = useState([])
     const [imageUrl, setImageUrl] = useState('')
     const [fakePath, setFakePath] = useState('')
     const [isOpen, setIsOpen] = useState(false)
     const [isOpenModal, setIsOpenModal] = useState(false)
    //  const LStoken = localStorage.getItem('token')
     
    function toggle() {
        setIsOpen(!isOpen)
       
    }


    // redirection if user is not logged //
    function redirectLogin() {
        history.push("/login")
    }

    useEffect(() => {
       if (!LStoken) {
        redirectLogin()
       }
    }, [])

    /////////////////////////////////////
   
    const fetchPosts = useCallback(()  => {
        Axios.get('http://localhost:3001/api/post', 
        {headers: {
            Authorization: LStoken
          }
        })
        .then((response) => {
             setPosts(response.data)
            
        })
    }, [LStoken])

    
    const submitPost = useCallback(() => {

        // correct fakepath error
        let filename = fakePath.replace(/^.*\\/, "");
        setImageUrl(filename)
        const imageUrl = filename
        //

        Axios.post('http://localhost:3001/api/post', {
            title : title,
            content : content,
            imageUrl : imageUrl
        },
        {headers: {
            Authorization: LStoken
          }
        })
        setIsOpenModal(!isOpenModal)
        setPosts([...posts, {title: title, content: content, image: imageUrl}])
    }, [content, imageUrl, title, posts, LStoken, isOpenModal ])

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, submitPost]);


    const deletePost = (id) => {
        Axios.delete(`http://localhost:3001/api/post/${id}`,
        {headers: {
            Authorization: LStoken
          }
        })
        const newPosts = posts.filter((post) => post.id !== id); 
        setPosts(newPosts)
    }

    
    return (
        <div className="forum-container">

            <button className="btn upload" onClick={() => setIsOpenModal(true)}><FaPlus/>Upload</button>
            <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
             <input className="input-file" placeholder="file" name="file" type="file" accept="image/*"
                    onChange={(e) => {
                        setFakePath(e.target.value)
                    }}
                    ></input>
                <input className="input-title" placeholder="title" name="title" type="text"
                onChange={(e) => {
                    setTitle(e.target.value)
                }}
                ></input>
                <textarea  className="input-content" placeholder="post" name="content" type="text"
                 onChange={(e) => {
                    setContent(e.target.value)
                }}></textarea>
                <button className="submit-btn" onClick={submitPost}>SUBMIT</button>
            </Modal>

          
            {posts.map((post) => {
                return (
                <div className="forum-card">
                    <div className="card-title-box">
                        <h2>{post.title} + {post.id} </h2>
                        <FaEllipsisV onClick={toggle} className="three-dots"/>
                    </div>

                    <img className="post-img" src={post.imageUrl} alt=''/>
                    <p>{post.content}</p>

                    <DropdownDelMod open={isOpen}>
                       <div className="card-buttons-box">
                            <button onClick={() => {deletePost(post.id)}} >DELETE</button>
                            <button>MODIFY</button>
                       </div>
                    </DropdownDelMod>
                </div>
                )
            }
            )}
        </div>
    
    )



}
