/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import University from './pages/University';
import Department from './pages/Department';
import Submit from './pages/Submit';
import Leaderboard from './pages/Leaderboard';
import Calculator from './pages/Calculator';
import Memes from './pages/Memes';
import GeoDrop from './pages/GeoDrop';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/geodrop" element={<GeoDrop />} />
          <Route path="/university/:id" element={<University />} />
          <Route path="/department/:id" element={<Department />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/memes" element={<Memes />} />
        </Routes>
      </Layout>
    </Router>
  );
}
