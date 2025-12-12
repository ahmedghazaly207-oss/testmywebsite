import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { DataUpdateProvider } from './context/DataUpdateContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import MatchDetails from './pages/MatchDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import ContactMessages from './pages/ContactMessages'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import News from './pages/News'
import PrivacyPolicy from './pages/PrivacyPolicy'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataUpdateProvider>
          <Router>
            <div className="app-container">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/contact-messages" element={<ContactMessages />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/match/:id" element={<MatchDetails />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<News />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </DataUpdateProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
