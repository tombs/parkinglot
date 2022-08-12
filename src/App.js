import logo from './logo.svg';
import './App.css';
import Car from './Vehicle';
import Dashboard from './Dashboard';

let entrances = ['A','B','C']

let lots = [{'number': 1, 'size':'S','distance':{'A':1, 'B':2, 'C':3}}]
// lots = [{'number': 2, 'size':'S','distance':['A','B','C']}]
// lots = [{'number': 3, 'size':'S','distance':['A','B','C']}]

function App() {
  return (
    // <div className="App">
    <div>
      <Dashboard />
    </div>
  );
}

export default App;
