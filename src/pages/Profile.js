import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullName: 'Alif Hafiz bin Danish',
        email: 'alif@gmail.com',
        role: 'Manager',
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [hoverBtn, setHoverBtn] = useState(null);

    const roleBadgeClass = user.role === 'Manager' ? 'bg-primary' : 'bg-secondary';

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((currentUser) => ({ ...currentUser, [name]: value }));
    };

    const toggleEditing = () => setIsEditing((prev) => !prev);

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to deactivate your account?')) {
            window.alert('Account deactivated');
            navigate('/');
        }
    };

    const getBtnStyle = (type) => {
        const isHovered = hoverBtn === type;
        let bgColor = 'transparent';
        let iconColor = '#6c757d';

        if (isHovered) {
            if (type === 'delete') {
                bgColor = 'rgba(220, 53, 69, 0.2)';
                iconColor = '#dc3545';
            } else if (type === 'edit') {
                bgColor = 'rgba(13, 110, 253, 0.2)';
                iconColor = '#0d6efd';
            }
        }

        return {
            background: bgColor,
            border: 'none',
            transition: 'all 0.2s ease-in-out',
            borderRadius: '4px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor
        };
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 position-relative">
                        
                        <div className="position-absolute top-0 end-0 m-3 d-flex align-items-center gap-2" style={{ zIndex: 10 }}>
                            
                            <button
                                type="button"
                                onClick={toggleEditing}
                                title={isEditing ? "Close" : "Edit profile"}
                                onMouseEnter={() => setHoverBtn('edit')}
                                onMouseLeave={() => setHoverBtn(null)}
                                style={getBtnStyle('edit')}
                            >
                                {isEditing ? (
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', padding: '0 4px' }}>X</span>
                                ) : (
                                    <img 
                                        src="/settings.png" 
                                        alt="Edit" 
                                        style={{ width: '20px', height: '20px', filter: hoverBtn === 'edit' ? 'invert(37%) sepia(93%) saturate(1469%) hue-rotate(202deg) brightness(97%) contrast(105%)' : 'none' }} 
                                    />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                title="Delete account"
                                onMouseEnter={() => setHoverBtn('delete')}
                                onMouseLeave={() => setHoverBtn(null)}
                                style={getBtnStyle('delete')}
                            >
                                <img 
                                    src="/delete.png" 
                                    alt="Delete" 
                                    style={{ width: '20px', height: '20px', filter: hoverBtn === 'delete' ? 'invert(15%) sepia(95%) saturate(6932%) hue-rotate(354deg) brightness(92%) contrast(93%)' : 'none' }} 
                                />
                            </button>
                        </div>

                        <div className="card-body text-center p-4 pt-5">
                            <img
                                src="/profile_picture.png"
                                alt="Profile"
                                className="rounded-circle mb-3 d-block mx-auto shadow-sm"
                                width="120"
                                height="120"
                            />
                            
                            <h2 className="h4 mb-3">User Profile</h2>
                            
                            <div className="mb-3">
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

                            <div className="mb-3">
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

                            <div className="mb-4">
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