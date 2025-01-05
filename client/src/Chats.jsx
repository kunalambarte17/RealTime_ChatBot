import './App.css'
import React,{useEffect, useState} from 'react'
import ParticlesComponent from './components/ParticlesComponent';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chats({ socket, username, room }) {

    const [currentMessage, setCurrentMessage] = React.useState("");
    const [messageList, setmessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(), 
            };
            await socket.emit("send_message", messageData);
            setmessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
      // Join the specified room
      socket.emit("join_room", room);

      // Handle receiving previous messages
      socket.on("previous_messages", (messages) => {
          setmessageList(messages); // Set the initial messages
      });

      // Handle receiving new messages
      socket.on("receive_message", (data) => {
          setmessageList((list) => [...list, data]);
      });

      // Cleanup listeners on unmount
      return () => {
          socket.off("previous_messages");
          socket.off("receive_message");
      };
  }, [socket, room]);

  return (
    <>
    <ParticlesComponent id="particles" />
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div className='message' id={username === messageContent.author ? 'you' : 'other'}>
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                    <p id='author'>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
         type='text'
         value={currentMessage}
         placeholder='Enter your message'
         onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}  
         onKeyDown={(event) => {event.key === 'Enter' && sendMessage()}}
        />
        <button onClick={sendMessage} className='send chat-footer-button'>Send</button>
      </div>
    </div>
    </>
  )
}

export default Chats
