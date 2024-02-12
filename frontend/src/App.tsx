import './App.css'
import { Landing } from './components/landing'

function App() {

  return (
    <>
    <header className="bg-gray-900 text-white py-6">
        <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-bold shadow-text">Swift Stack</h1>
        </div>
    </header>
      <Landing />
    </>
  )
}

export default App
