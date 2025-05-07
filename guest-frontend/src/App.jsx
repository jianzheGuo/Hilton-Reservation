import { Router, Route } from "@solidjs/router";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';

function App() {
  return (
    <Router>
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
    </Router>
  );
}

export default App;
