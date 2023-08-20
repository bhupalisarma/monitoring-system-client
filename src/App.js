import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Admin from './components/Admin';
import Mentor from './components/Mentor';
import Classroom from './components/Classroom';
import Mentee from './components/Mentee';


const App = () => {
  return (
    <Router>
      <Routes>
          <Route exact path='/' element={< Home />}></Route>
          <Route exact path='/signup' element={< Signup />}></Route>
          <Route exact path='/login' element={< Login />}></Route>
          <Route exact path='/admin' element={< Admin />}></Route>
          <Route exact path='/mentor' element={< Mentor />}></Route>
          <Route exact path='/mentee' element={< Mentee />}></Route>
          
          <Route path="/mentor/classroom/:classroomId" element={<Classroom />} />
          <Route path="/mentee/classroom/:classroomId" element={<Classroom />} />
          <Route path="/admin/classroom/:classroomId" element={<Classroom />} />
      </Routes>
    </Router>
  );
};

export default App;
