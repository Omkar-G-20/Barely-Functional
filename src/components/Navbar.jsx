import React from "react";
import { Link } from "react-router-dom";
import { Leaf, LogIn } from "lucide-react";

function Navbar() {
    return (
        <nav className="navbar">

            <Link to="/" className="brand">
                <div className="brand-icon">
                    <Leaf size={22} />
                </div>

                <span>AgriSense AI</span>
            </Link>

            <div className="nav-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#about">About</a>

                <Link to="/login" className="nav-login">
                    <LogIn size={17} />
                    Login
                </Link>
            </div>

        </nav>
    );
}

export default Navbar;