import './App.css';
import Main from './component/Main';
import Comp1 from './component/Comp1';
import Comp2 from './component/Comp2';
import Comp3 from './component/Comp3';
import Comp4 from './component/Comp4';
import Comp5 from './component/Comp5';
import Comp6 from './component/Comp6';
import { Wallet } from './component/Wallet.tsx';

function App() {
  return (
    <div className="App">
      <Wallet />
      <Main />
      <Comp1 />
      <Comp2 />
      <Comp3 />
      <Comp4 />
      <Comp5 />
      <Comp6 />
    </div>
  );
}

export default App;
