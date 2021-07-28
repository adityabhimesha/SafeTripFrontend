import './App.css';
import Header from './components/Navbar/Navbar'
import './custom.scss';
import {Container} from 'react-bootstrap';
import Main from "./components/Main/Main";

function App() {
  return (
    <div className="App" style={{backgroundImage:`url('bg-main-2.svg')`}}>

      <Container>
        <Header/>

        <div className="layout">
          <Main>
            
          </Main>
        </div>
      </Container>
      
    </div>
    
  );
}

export default App;
