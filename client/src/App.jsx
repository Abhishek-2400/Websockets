import { io } from 'socket.io-client'
import { useEffect, useMemo, useState } from 'react'
const App = () => {
  const socket = useMemo(() => io('https://websockets-3g5u.onrender.com'), [])
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  const [message, setMessage] = useState({
    message: "",
    room: ""
  });

  const changeHandler = (e) => {
    setMessage((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const roomHandler = (e) => {
    setRoom(e.target.value);
  }
  const handlesubmit = (e) => {
    e.preventDefault();
    socket.emit('message', message);

  }
  const roomSubmit = (e) => {
    e.preventDefault();
    socket.emit('create-room', room);
  }

  useEffect(() => {
    socket.on('connect', () => {                //1
      console.log('connected', socket.id)
      setSocketId(socket.id)
    })
    socket.on('welcome', (data) => {
      alert(data)           //2
      console.log(data)
    })
    socket.on('notify', (data) => {
      alert(data)          //3
      console.log(data)
    })

    socket.on('toallusers', (data) => {
      console.log(`public message : ${data}`)   //4
      setMessages((prev) => [...prev, `public message: ${data}`]);
    })

    socket.on('broadcasted', (data) => {
      console.log(`broadcasted message: ${data}`)  //5
      setMessages((prev) => [...prev, `broadcasted message: ${data}`]);
    })

    socket.on('foryou', (data) => {
      console.log(`private message : ${data}`) //6
      setMessages((prev) => [...prev, `private message : ${data}`]);
    })


    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      <h1>Chit Chat app !</h1>
      <h3>{`Your socket id is :         ${socketId}`}</h3>
      <form onSubmit={handlesubmit}>

        <p>Enter message</p>
        <input placeholder='enter message' required name='message' value={message.message} onChange={(e) => { changeHandler(e) }} />

        <p>Enter room no / id of  if you want to do a room chat / room chat</p>
        <input placeholder='enter room' name='room' value={message.room} onChange={(e) => { changeHandler(e) }} />

        <br></br>
        <br></br>


        <button type='submit'>Send</button>
      </form>

      <br></br>
      <br></br>

      <form onSubmit={roomSubmit}>

        <p>Enter room name to be joined</p>
        <input placeholder='enter message' name='roomname' value={room} onChange={(e) => { roomHandler(e) }} />

        <br></br>
        <br></br>


        <button type='submit'>Join Room</button>
      </form>


      <br></br>
      <br></br>
      <br></br>

      {
        messages.map((val, index) => {
          return <>
            <div>
              {val}
            </div>
            <br></br>
            <br></br>
          </>

        })
      }
    </>

  )
}

export default App
