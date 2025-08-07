import './App.css'
import './styles/colors.css'

import Home from './pages/HomePage/Home'
import ChatWithAI from './components/Chat-With-AI/ChatWithAI'

function App() {

  return (
    <>
      <div className='App'>
        <Home />
        <ChatWithAI />
      </div>
    </>
  )
}

export default App
