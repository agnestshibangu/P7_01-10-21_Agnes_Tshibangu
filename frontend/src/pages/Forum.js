import React, { useEffect, useCallback, useState, useContext } from 'react';
import Axios from "axios";
import '../style/forum.css'
// import DropdownDelMod from '../components/DropdownDelMod'
import Modal from '../components/Modal'
import CommentSection from '../components/CommentSection';
import DataContext from '../DataContext'
import { useHistory } from "react-router-dom";
import FormData from 'form-data'
import ModifyModal from '../components/ModifyModal';
import { FaPlus } from 'react-icons/fa';

export default function Forum() {

const history = useHistory();

const { dataUser, LStoken } = useContext(DataContext)
const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [posts, setPosts] = useState([])
const [isOpenModal, setIsOpenModal] = useState(false)
const [isOpenModifyModal, setIsOpenModifyModal] = useState(false)
const [modifyPostId, setModifyPostId] = useState('')
const [file, setFile] = useState('')



const userId = dataUser.id


function getPostId(postId) {
    setModifyPostId(postId)
    console.log(modifyPostId)
}

function openModify() {
    setIsOpenModifyModal(true)
}


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

    const userName = dataUser.name
    const userId = dataUser.id
    // formData auqul on ajoute un fichier + tout les champs text
    const myformData = new FormData();
    myformData.append("title", title)
    myformData.append("content", content)
    myformData.append("userId", userId)
    myformData.append("userName", userName)
    // ajouter champ moderator
    myformData.append("file", file)

    Axios.post("http://localhost:3001/api/post", myformData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': LStoken
            }
        }
    )
        .then(res => console.log(res))
    setIsOpenModal(!isOpenModal)
    // refresh page after submit
    window.location.reload();
    setPosts([...posts, { title: title, content: content, image: file }])
}, [content, title, file, userId, posts, LStoken, isOpenModal])


///////////////////////////////////

useEffect(() => {
    fetchPosts();
}, []);

///////////////////////////////////


const modifyPost = useCallback(() => {


    const userName = dataUser.name
    const userId = dataUser.id
    const myformData = new FormData();
    myformData.append("title", title)
    myformData.append("content", content)
    myformData.append("userId", userId)
    myformData.append("userName", userName)
    myformData.append("file", file)
   
    Axios.put(`http://localhost:3001/api/post/${modifyPostId}`, myformData,
        {
            headers: {
                'Authorization': LStoken
            }
        }
    )
    .then(res => console.log(res))
    setIsOpenModal(!isOpenModal)
    // refresh page after submit
    window.location.reload();
    setPosts([...posts, { title: title, content: content, image: file }])
}, [content, title, file, userId, posts, LStoken, isOpenModal])

///////////////////////////////////


const deletePost = (id) => {
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



        <ModifyModal openModify={isOpenModifyModal} onClose={() => setIsOpenModifyModal(false)}>
            <input className="input-file" placeholder="file" name="file" type="file" accept=".jpg"
                onChange={(e) => {
                    const file = e.target.files[0]
                    setFile(file)
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
            <button className="submit-btn" onClick={modifyPost}>MODIFY</button>
        </ModifyModal>



        {posts.map((post) => {
            //{posts.map((post, ofUser) => {
            const postId = post.id

            return (
                <div key={post.id} className="forum-card">
                    <div className="card-title-box">
                        <h2>{post.title} </h2>
                        <p className="created-by-tag-laptop">post créé par {post.userName}</p>

                    </div>
                    <p className="created-by-tag-smartphone">post créé par {post.userName}</p>
                    <div className="card-body">

                        <img className="post-img" src={`${post.imageUrl}`} alt='' />
                        <div className="container-buttons">

                            {post.userId == userId || dataUser.moderator == true ?

                                <div>
                                    <button className="delete-btn" onClick={() => { deletePost(post.id, post.userId) }}>DELETE</button>
                                    <button className="modify-btn" onClick={() => { openModify(); getPostId(postId); }}>MODIFY</button>
                                </div>

                                : null}

                        </div>

                    </div>

                    <p>{post.content} </p>
                    

                   {/* // <DropdownDelMod open={isOpen} postId={post.id} > */}

                        <div className="container-DropdownDelMod">

                            <div className="container-comments">

                                <CommentSection postId={post.id} />

                            </div>

                        </div>
{/* 
                   // </DropdownDelMod> */}
                </div>
            )
        }
        )}
    </div>

)



}