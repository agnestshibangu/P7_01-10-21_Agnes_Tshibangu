
import React, { useEffect, useCallback, useState, useContext } from 'react';
import Axios from "axios";
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import '../forum.css'
import DropdownDelMod from '../components/DropdownDelMod'
import Modal from '../components/Modal'
import CommentSection from '../components/CommentSection';
import DataContext from '../DataContext'
import { useHistory } from "react-router-dom";
import FormData from 'form-data'




export default function Forum() {

    const history = useHistory();

    const { dataUser, LStoken } = useContext(DataContext)
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([])
    //const [imageUrl, setImageUrl] = useState('')
    //const [fakePath, setFakePath] = useState('')
    const [isOpen, setIsOpen] = useState(true)
    const [isOpenModal, setIsOpenModal] = useState(false)
    ///
    const [file, setFile] = useState('')
    // const [isToggledDelMod, setisToggledDelMod] = useState(false)

    const userId = dataUser.id
    const moderator = dataUser.moderator


    //  const LStoken = localStorage.getItem('token')

    // function toggle() {
    //     setIsOpen(!isOpen)
    // }

    // redirection if user is not logged //
    function redirectLogin() {
        history.push("/login")
    }

    useEffect(() => {
        if (!LStoken) {
            redirectLogin()
        }
    }, [LStoken])

    /////////////////////////////////////

    const fetchPosts = useCallback(() => {
        Axios.get('http://localhost:3001/api/post',
            {
                headers: {
                    Authorization: LStoken
                }
            })
            .then((response) => {
                setPosts(response.data)
            })


    }, [LStoken, posts])

    ///////////////////////////////////


    const submitPost = useCallback(() => {

        // correct fakepath error
        // let filename = fakePath.replace(/^.*\\/, "");
        // setImageUrl(filename)
        // const imageUrl = filename
        //  
        const userName = dataUser.name
        const userId = dataUser.id
        console.log(LStoken)
        // 
        const myformData = new FormData();
        myformData.append("file", file)
        // console.log(imageUrl)

        //Axios.post("http://httpbin.org/anything", myformData,
        Axios.post("http://localhost:3001/api/post", myformData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': LStoken
                }
            }
        )
        .then(res => console.log(res))
      







        // multipart form data
        // const form =     {
        //     title: title,
        //     content: content,
        //     imageUrl: imageUrl,
        //     userId: userId,
        //     userName: userName
        // }
        // const { files } =  imageUrl

        // console.log(file)

        // const fd = new FormData();
        // // fd.append("form", form)
        // fd.append('file', file, file.name)
        // console.log(fd)

        // Axios.post("http://httpbin.org/anything", fd,
        //  //Axios.post('http://localhost:3001/api/post', fd,
        //     {
        //         headers: {
        //             'Content-Type': `multipart/form-data; boundary=${fd._boundary}`,
        //             'Authorization': LStoken
        //         }
        //     }
        // )
        // .then(res => console.log(res))
        setIsOpenModal(!isOpenModal)
        setPosts([...posts, { title: title, content: content, image: file }])
        // window.location.reload(false)
    }, [content, title, file, userId, posts, LStoken, isOpenModal])

    useEffect(() => {
        fetchPosts();

    }, []);


    const deletePost = (id, userId) => {
        Axios.delete(`http://localhost:3001/api/post/${id}`,
            {
                headers: {
                    Authorization: LStoken
                }
            }
        )
        const newPosts = posts.filter((post) => post.id !== id);
        setPosts(newPosts)
    }


    return (
        <div className="forum-container">
            <h1 className="hidden-h1">Forum</h1>

            <button className="btn upload" onClick={() => setIsOpenModal(true)}><FaPlus />Upload</button>
            <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
                <input className="input-file" placeholder="file" name="file" type="file" accept=".jpg"
                    onChange={(e) => {
                        const file = e.target.files[0]
                        setFile(file)
                        //setFakePath(e.target.value)
                        // setFakePath(e.target.files[0])
                    }}
                ></input>
                <input className="input-title" placeholder="title" name="title" type="text"
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                ></input>
                <textarea className="input-content" placeholder="post" name="content" type="text"
                    onChange={(e) => {
                        setContent(e.target.value)
                    }}></textarea>
                <button className="submit-btn" onClick={submitPost}>SUBMIT</button>
            </Modal>


            {posts.map((post, ofUser) => {
            console.log(post)


                return (
                    <div key={post.id} className="forum-card">
                        <div className="card-title-box">
                            <h2>{post.title} </h2>
                            <p className="created-by-tag-laptop">post créé par {post.userName}</p>
                            {/* <FaEllipsisV onClick={toggle} className="three-dots" /> */}
                        </div>
                        <p className="created-by-tag-smartphone">post créé par {post.userName}</p>
                        <div className="card-body">

                            <img className="post-img" src={`${post.imageUrl}`} alt='' />
                            <div className="container-buttons">

                                {post.userId == userId || dataUser.moderator == true ?

                                    <div>
                                        <button className="delete-btn" onClick={() => { deletePost(post.id, post.userId) }} >DELETE</button>
                                        <button className="modify-btn">MODIFY</button>
                                    </div>

                                    : null}

                            </div>

                        </div>

                        <p>{post.content} </p>

                        <DropdownDelMod open={isOpen} postId={post.id} >

                            <div className="container-DropdownDelMod">

                                <div className="container-comments">

                                    <CommentSection postId={post.id} />

                                </div>

                            </div>

                        </DropdownDelMod>
                    </div>
                )
            }
            )}
        </div>

    )



}