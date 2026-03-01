import { CityScene } from './CityScene'
import { BackgroundMusic } from './BackgroundMusic'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="scene-header">
        <h1>Ev's Dance</h1>
        <p className="scene-tagline">
          Drag the van to the studio, then click &quot;Get out&quot; so Mom and
          the two girls come out &bull; Drag cars
        </p>
        <BackgroundMusic />
      </header>
      <CityScene />
    </div>
  )
}

export default App
