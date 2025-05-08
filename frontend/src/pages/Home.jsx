import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const containerStyle = {
        backgroundImage: 'url("https://images.unsplash.com/photo-1730780883153-b3c046b001c1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
    };

    const overlayStyle = {
        backgroundColor: 'rgb(240, 240, 240)',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        color: 'black',
    };

    const headingStyle = {
        marginBottom: '20px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '20px',
    };

    const buttonStyle = {
        backgroundColor: '#800080',
        color: 'white',
        padding: '12px 24px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        textAlign: 'center',
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'GET',
                credentials: 'include', // Important for sending cookies
            });
    
            if (response.ok) {
                navigate('/'); // Redirect to home or login page
            } else {
                console.error('Logout failed');
            }
        } catch (err) {
            console.error('Logout error:', err);
        }
    };
    

    return (
        <div style={containerStyle}>
            <div style={overlayStyle}>
                <h1 style={headingStyle}>Welcome to Cafeteria Ordering System</h1>
                <p>Please use the buttons below to navigate the website</p>
                <div style={buttonContainerStyle}>
                    <Link to="/menu" style={buttonStyle}>View Menu</Link>
                    <Link to="/order-history" style={buttonStyle}>Order History</Link>
                    <Link to="/modify-menu" style={buttonStyle}>Modify Menu</Link> {/* Updated to Link */}
                    <button style={buttonStyle} onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
