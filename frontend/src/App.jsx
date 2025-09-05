// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Header from './components/common/Header/Header'
// import Home from './pages/Home/Home'
// import Dashboard from './pages/Dashboard/Dashboard'
// import CreateEvent from './pages/CreateEvent/CreateEvent'
// import NotFound from './pages/NotFound/NotFound'
// import EventDetail from './pages/EventDetail/EventDetail'
// import './App.css'

// function App() {
//   return (
//     <Router>
//       <div className="app">
//         <Header />
//         <main className="app-main">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/create-event" element={<CreateEvent />} />
//             <Route path="/event/:eventId" element={<EventDetail />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   )
// }

// export default App
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Header from './components/common/Header/Header'
import Notification from './components/common/Notification/Notification'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import CreateEvent from './pages/CreateEvent/CreateEvent'
import EventDetail from './pages/EventDetail/EventDetail'
import NotFound from './pages/NotFound/NotFound'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Header />
          <Notification />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:eventId" element={<EventDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
