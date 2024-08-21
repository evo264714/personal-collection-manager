import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CollectionList from "./components/CollectionList";
import CollectionForm from "./components/CollectionForm";
import ItemForm from "./components/ItemForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import UpdateCollectionForm from "./components/UpdateCollectionForm";
import UpdateItemForm from "./components/UpdateItemForm";
import CollectionDetails from "./components/CollectionDetails";
import { ThemeProvider } from "./context/ThemeContext";
import AdminDashboard from "./components/AdminDashboard";
import "./i18n";
import MyCollections from "./components/MyCollections";
import Home from "./pages/Home";
import { monitorAuthState } from "./firebase";
import ProtectedAdminRoute from "./Routes/ProtectedAdminRoute ";

function App() {
  useEffect(() => {
    monitorAuthState();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<CollectionList />} />
          <Route path="/collections/new" element={<CollectionForm />} />
          <Route path="/collections/:id" element={<CollectionDetails />} />
          <Route path="/collections/:id/items/new" element={<ItemForm />} />
          <Route
            path="/collections/:id/edit"
            element={<UpdateCollectionForm />}
          />
          <Route
            path="/collections/:collectionId/items/:itemId/edit"
            element={<UpdateItemForm />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/my-collections" element={<MyCollections />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
