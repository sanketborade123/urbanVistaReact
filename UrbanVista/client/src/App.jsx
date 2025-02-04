import {Route,Routes,BrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/privateroute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

export default function App() {
  return <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="sign-up" element={<Signup/>}></Route>
      <Route path="sign-in" element={<Signin/>}></Route>
      <Route path="about" element={<About/>}></Route>
      <Route path="search" element={<Search/>}></Route>
      <Route path="listing/:listingId" element={<Listing/>}></Route>
      <Route element={<PrivateRoute/>}>
      <Route path="profile" element={<Profile/>}></Route>
      <Route path="create-listing" element={<CreateListing/>}></Route>
      <Route path="update-listing/:listingId" element={<UpdateListing/>}></Route>
      </Route>

    </Routes>

  
  </BrowserRouter>
}
