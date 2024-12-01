//library import
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import LoaderLayout from "./components/Loader";
import "./App.css";

// Lazy load your components
const Navbar = lazy(() => import("./components/Navbar"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Account = lazy(() => import("./pages/Account"));
const Kyc = lazy(() => import("./pages/Kyc"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const Approved = lazy(() => import("./pages/Approved"));
const My = lazy(() => import("./pages/My"));
const VerifiedUserListPage = lazy(() => import("./pages/VerifiedUserListPage"));
const UploadNID = lazy(() => import("./pages/UploadNID"));
const BlockListPage = lazy(() => import("./pages/BlockList"));
const History = lazy(() => import("./pages/History"));
const Verified = lazy(() => import("./pages/org/Verified"));
const Verifier = lazy(() => import("./pages/admin/Verifier"));

function App() {
  const isUserSignedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  return (
    <ChakraProvider>
      <Suspense fallback={<LoaderLayout />}>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {isUserSignedIn && <Route path="/account" element={<Account />} />}
            {isUserSignedIn && <Route path="/Kyc" element={<Kyc />} />}
            {isUserSignedIn && (
              <Route path="/uploadNID" element={<UploadNID />} />
            )}
            {isUserSignedIn && (
              <Route
                path="/verifiedUserList"
                element={<VerifiedUserListPage />}
              />
            )}
            {isUserSignedIn && (
              <Route path="/blockList" element={<BlockListPage />} />
            )}
            {isUserSignedIn && (
              <Route path="/user/:nidNumber" element={<UserDetails />} />
            )}
            {isUserSignedIn && (
              <Route path="/approved" element={<Approved />} />
            )}
            {isUserSignedIn && <Route path="/my" element={<My />} />}
            {isUserSignedIn && <Route path="/history" element={<History />} />}
            {isUserSignedIn && (
              <Route path="/verifier" element={<Verifier />} />
            )}
            {isUserSignedIn && <Route path="/ekyc" element={<Verified />} />}
          </Routes>
        </div>
      </Suspense>
    </ChakraProvider>
  );
}

export default App;
