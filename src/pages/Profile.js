import React, { useState } from 'react';

function Profile() {
    const [user, setUser] = useState({
        fullName: 'Alif Hafiz bin Danish',
        email: 'alif@gmail.com',
        role: 'Manager',
    });
    
    const [isEditing, setIsEditing] = useState(false);

    const roleBadgeClass = user.role === 'Manager' ? 'bg-primary' : 'bg-secondary';

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((currentUser) => ({
            ...currentUser,
            [name]: value,
        }));
    };

    const toggleEditing = () => {
        setIsEditing((currentValue) => !currentValue);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 position-relative">
                        
                        <button
                            type="button"
                            onClick={toggleEditing}
                            className="btn btn-link position-absolute top-0 end-0 m-3 p-0 text-decoration-none border-0"
                            title={isEditing ? "close" : "edit profile"}
                            style={{ background: 'none' }}
                        >
                            {isEditing ? (
                                <span style={{ fontSize: '1.2rem', color: '#6c757d', fontWeight: 'bold' }}>X</span>
                            ) : (
                                <img 
                                    src="/settings.png"
                                    alt="Settings" 
                                    style={{ width: '24px', height: '24px' }}
                                />
                            )}
                        </button>

                        <div className="card-body text-center p-4">
                            <img
                                src="/profile_picture.png"
                                alt="Profile"
                                className="rounded-circle mb-3 d-block mx-auto shadow-sm"
                                width="120"
                                height="120"
                            />
                            
                            <h2 className="h4 mb-3">User Profile</h2>
                            
                            <div className="mb-3 text-center">
                                <p className="mb-1 fw-semibold">Full Name</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={user.fullName}
                                        onChange={handleChange}
                                        className="form-control text-center"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-muted mb-0">{user.fullName}</p>
                                )}
                            </div>

                            <div className="mb-3 text-center">
                                <p className="mb-1 fw-semibold">Email</p>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        className="form-control text-center"
                                    />
                                ) : (
                                    <p className="text-muted mb-0">{user.email}</p>
                                )}
                            </div>

                            <div className="mb-4 text-center">
                                <p className="mb-2 fw-semibold">Role</p>
                                {isEditing ? (
                                    <select
                                        name="role"
                                        value={user.role}
                                        onChange={handleChange}
                                        className="form-select text-center"
                                    >
                                        <option value="Manager">Manager</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                ) : (
                                    <span className={`badge ${roleBadgeClass} px-3 py-2`}>
                                        {user.role}
                                    </span>
                                )}
                            </div>

                            {isEditing && (
                                <button 
                                    className="btn btn-success btn-sm w-100 mt-2 shadow-sm" 
                                    onClick={toggleEditing}
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;