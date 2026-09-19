import React from "react";
import Sidebar from "../components/Sidebar";

function ProfilePage() {

    return (
        <div className="app-layout">

            <Sidebar />

            <main className="dashboard-main">

                <div className="page-heading">

                    <span>ACCOUNT</span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your account information.
                    </p>

                </div>

                <div className="profile-card">

                    <div className="profile-avatar">
                        F
                    </div>

                    <div className="profile-details">

                        <h2>
                            Farmer
                        </h2>

                        <p>
                            farmer@example.com
                        </p>

                    </div>

                </div>

                <div className="settings-form">

                    <label>Full Name</label>

                    <input
                        value="Farmer"
                        readOnly
                    />

                    <label>Email</label>

                    <input
                        value="farmer@example.com"
                        readOnly
                    />

                    <label>Mobile Number</label>

                    <input
                        placeholder="Enter mobile number"
                    />

                    <label>Farm Information</label>

                    <textarea
                        placeholder="Enter farm information"
                    />

                    <button className="primary-button">
                        Save Changes
                    </button>

                </div>

            </main>

        </div>
    );
}

export default ProfilePage;