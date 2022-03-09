import './App.css';
import { useEffect, useRef, useState } from 'react';
import openSocket from 'socket.io-client'

const socket_url = "https://socket.retinahealth.ai/"

function App() {

  const [name, setName] = useState("")
  const [joinedRoom, setJoinedRoom] = useState(false)
  const [data, setData] = useState([])
  const socket = useRef()

  const setup = (e) => {
    e.preventDefault()
    socket.current = openSocket(socket_url).emit('create-room', name)
    socket.current.on("command", (f) => {
      setData((prevData) => [...prevData, JSON.stringify(f)])
    })
    setJoinedRoom(true)
  }

  const leaveRoom = () => {
    socket.current.emit('close-room', name)
    setData([])
    setJoinedRoom(false)
  }

  return (
    <div className="App">
      <h1>Socket tester</h1>
      {!joinedRoom && <form onSubmit={setup}>
        <input type="text" onChange={e => setName(e.target.value)} required/>
        <button>join room</button>
      </form>}
      {joinedRoom && <>
        <h2>Active user: {name}</h2>
        <button onClick={leaveRoom}>leave room</button>

        <br />
        <h4>Data Outputs</h4>
        <ul>
          {data.map((d,i) => <li key={i}>{d}</li>)}
        </ul>
      </>}
    </div>
  );
}

export default App;
