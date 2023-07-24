import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Classroom = () => {
    const { classroomId } = useParams();
    const [posts, setPosts] = useState([]);
    const [students, setStudents] = useState([]);

    const handleCreatePost = (e) => {
        e.preventDefault();
        const newPost = {
            id: posts.length + 1,
            heading: e.target.elements.postHeading.value,
            content: e.target.elements.postContent.value,
            files: Array.from(e.target.elements.postFiles.files),
            createdAt: new Date(),
            comments: [],
        };
        setPosts([...posts, newPost]);
        e.target.reset();
    };

    const handleCreateComment = (postId, e) => {
        e.preventDefault();
        const comment = {
            id: posts.length + 1,
            content: e.target.elements.commentContent.value,
            createdAt: new Date(),
        };
        const updatedPosts = posts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, comment],
                };
            }
            return post;
        });
        setPosts(updatedPosts);
        e.target.reset();
    };

    const handleDownloadFile = (file) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddStudent = () => {
        const studentName = prompt('Enter the name of the student');
        if (studentName) {
            setStudents([...students, studentName]);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-4">Classroom {classroomId}</h2>

            <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">Create New Post</h3>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    onClick={handleAddStudent}
                >
                    Add Student
                </button>
            </div>

            <div className="bg-white rounded shadow p-4 mb-6">
                <form onSubmit={handleCreatePost}>
                    <input
                        type="text"
                        name="postHeading"
                        className="w-full rounded border-gray-300 mb-2"
                        placeholder="Post Heading"
                        required
                    />
                    <textarea
                        name="postContent"
                        rows="3"
                        className="w-full rounded border-gray-300 mb-2"
                        placeholder="Write your post..."
                        required
                    ></textarea>
                    <input type="file" name="postFiles" multiple className="mb-2" />
                    <button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
                    >
                        Create Post
                    </button>
                </form>
            </div>

            {posts.length > 0 ? (
                <div className="bg-white rounded shadow p-4">
                    <h3 className="text-xl font-semibold mb-2">Posts</h3>
                    {posts.map((post) => (
                        <div key={post.id} className="mb-4">
                            <h4 className="text-lg font-semibold mb-1">{post.heading}</h4>
                            <p className="text-gray-800 mb-1">{post.content}</p>
                            {post.files && post.files.length > 0 && (
                                <div className="mt-2">
                                    <h5 className="text-md font-semibold mb-1">Attachments:</h5>
                                    {post.files.map((file, index) => (
                                        <div key={index} className="flex items-center mt-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-4 h-4 mr-1 text-gray-500"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                                />
                                            </svg>
                                            <a
                                                href="#"
                                                className="text-blue-500 hover:text-blue-600"
                                                onClick={() => handleDownloadFile(file)}
                                            >
                                                {file.name}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-gray-500 text-sm">{post.createdAt.toLocaleString()}</p>

                            {/* Comment Section */}
                            <div className="mt-4">
                                <h5 className="text-md font-semibold mb-1">Comments:</h5>
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="flex items-center mt-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-4 h-4 mr-1 text-gray-500"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                            />
                                        </svg>
                                        <p className="text-gray-800">{comment.content}</p>
                                    </div>
                                ))}
                                <form onSubmit={(e) => handleCreateComment(post.id, e)}>
                                    <textarea
                                        name="commentContent"
                                        rows="2"
                                        className="w-full rounded border-gray-300 mt-2"
                                        placeholder="Add a comment..."
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded mt-2"
                                    >
                                        Add Comment
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No posts yet.</p>
            )}
        </div>
    );
};

export default Classroom;
