import React from "react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";

function SettingsPage() {

    return (
        <div className="app-layout">

            <Sidebar />

            <AppHeader />

            <main className="dashboard-main">

                <div className="page-heading">

                    <span>SETTINGS</span>

                    <h1>
                        Application Settings
                    </h1>

                    <p>
                        Customize your AgriSense AI experience.
                    </p>

                </div>

                <div className="settings-card">

                    <div className="setting-row">

                        <div>
                            <h3>
                                Language
                            </h3>

                            <p>
                                Choose your preferred language.
                            </p>
                        </div>

                        <select>
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Marathi</option>
                            <option>Kannada</option>
                        </select>

                    </div>

                    <div className="setting-row">

                        <div>
                            <h3>
                                Notifications
                            </h3>

                            <p>
                                Receive quality analysis notifications.
                            </p>
                        </div>

                        <label className="toggle">
                            <input
                                type="checkbox"
                                defaultChecked
                            />
                            <span></span>
                        </label>

                    </div>

                    <div className="setting-row">

                        <div>
                            <h3>
                                Offline Mode
                            </h3>

                            <p>
                                Store tests locally when offline.
                            </p>
                        </div>

                        <label className="toggle">
                            <input type="checkbox" />
                            <span></span>
                        </label>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default SettingsPage;