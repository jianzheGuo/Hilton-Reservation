import { Router, Route } from "@solidjs/router";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Reservation from "./pages/Reservation/Reservation";
import Admin from "./pages/Admin/Admin";

function App() {
  // createEffect(() => {
  //   const userData = sessionStorage.getItem('userData');
  //   if (userData) {
  //     updateUserFromStore(JSON.parse(userData));
  //   }
  // });

  return (
    <Router>
      <Route path="/home" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/reservation" component={Reservation} />
      <Route path="/admin" component={Admin} />
    </Router>
  );
}

export default App;
