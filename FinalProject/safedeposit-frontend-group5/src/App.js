/* Author: Dhrumil Amish Shah (B00857606) */
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login1 } from "./components/Login/Login1";
import { Login2 } from "./components/Login/Login2";
import { Login3 } from "./components/Login/Login3";
import { Register } from "./components/Register/Register";
import { Home } from "./components/Home/Home";
import OnlineSupport from "./components/support/OnlineSupport";

function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route exact path="/" element={<Register />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login1" element={<Login1 />} />
        <Route exact path="/login2" element={<Login2 />} />
        <Route exact path="/login3" element={<Login3 />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/online-support" element={<OnlineSupport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
