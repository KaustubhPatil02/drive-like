import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    fetchFolders();
    fetchImages();
  }, []);

  const fetchFolders = async () => {
    const { data } = await axios.get("http://localhost:5000/api/folders", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    setFolders(data);
  };

  const fetchImages = async () => {
    const { data } = await axios.get("http://localhost:5000/api/images", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    setImages(data);
  };

  const handleCreateFolder = async () => {
    await axios.post("http://localhost:5000/api/folders", { name: folderName }, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    fetchFolders();
  };

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={logout}>Logout</button>

      <h3>Create Folder</h3>
      <input type="text" onChange={(e) => setFolderName(e.target.value)} placeholder="Folder Name" />
      <button onClick={handleCreateFolder}>Create</button>

      <h3>Your Folders</h3>
      <ul>
        {folders.map(folder => (
          <li key={folder._id}>{folder.name}</li>
        ))}
      </ul>

      <h3>Your Images</h3>
      <ul>
        {images.map(image => (
          <li key={image._id}>
            {image.name} - <img src={`http://localhost:5000/${image.url}`} alt={image.name} width="50" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
