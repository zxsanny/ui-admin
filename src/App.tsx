import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin/Admin';

const App: React.FC = () => {
    return (
        <Router>
            <div style={{ width: '100%', height: '100vh' }}>
                <Routes>
                    <Route path="/*" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
