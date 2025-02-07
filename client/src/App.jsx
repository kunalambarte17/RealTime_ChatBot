import './App.css'
import io from 'socket.io-client'
import { useState } from 'react'
import Chats from './Chats'

const socket = io.connect("http://localhost:3000")

function App() {

  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <>
    <div className="App">
      {!showChat ? (
      <div className="joinChatContainer">
      <h3>Join A Chat</h3>
      <p>(Room ID: Room4321)</p>
      <input 
        type="text" 
        placeholder="Enter your name" 
        onChange={(event) => {
          setUsername(event.target.value);
        }}  
      />
      <input 
        type="text" 
        placeholder="Enter room ID" 
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}>Join A Room</button>
      </div>
      )
    : (
      <Chats socket={socket} username={username} room={room} />
    )} 
    </div>
    
    </>
  )
}

export default App
