function Profile() {
	const user = {
		fullName: 'Alif Hafiz bin Danish',
		email: 'alif@gmail.com',
		role: 'Manager',
	};

	const roleBadgeClass = user.role === 'Manager' ? 'bg-primary' : 'bg-secondary';

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-4">
					<div className="card shadow-sm border-0">
						<div className="card-body text-center p-4">
							<img
								src="/profile_picture.png"
								alt="Profile picture"
								className="rounded-circle mb-3 d-block mx-auto"
								width="120"
								height="120"
							/>
							<h2 className="h4 mb-3">User Profile</h2>
							<div className="mb-3">
								<p className="mb-1 fw-semibold">Full Name</p>
								<p className="text-muted mb-0">{user.fullName}</p>
							</div>
							<div className="mb-3">
								<p className="mb-1 fw-semibold">Email</p>
								<p className="text-muted mb-0">{user.email}</p>
							</div>
							<div>
								<p className="mb-2 fw-semibold">Role</p>
								<span className={`badge ${roleBadgeClass} px-3 py-2`}>{user.role}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
