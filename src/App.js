import {useEffect, useState, useRef} from 'react';

function App() {
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);
  const loginForm = useRef(null);
  const registerForm = useRef(null);

  const register = (e) => {
    e.preventDefault();
    const data = new FormData(registerForm.current)
    const formToObject = Object.fromEntries(data.entries());
    fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Credentials": "include"
      },
      body: JSON.stringify(formToObject)
    })
    .then(response => {
      console.log(response.status, response.headers.get("Content-Type"));
      if(response.status !== 200){
        return response.json().then(data => {throw new Error(data.message)})
      } else {
        return response.json();
      }
    })
    .then(response => {
      setUser(response.data);
      setNotification("You successfully registered!");
    })
    .catch(error => {
      setNotification(error.message);
      setTimeout(()=>{
        setNotification(null);
      }, 6000);
    })
  }
  const login = (e) => {
    e.preventDefault();
    const data = new FormData(loginForm.current)
    const formToObject = Object.fromEntries(data.entries());
    fetch("http://localhost:5000/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:5000",
      body: JSON.stringify(formToObject)
    })
    .then(response => {
      response.headers.forEach((value, key) => {
        console.log(key, value);
      })
      if(response.status !== 200){
        return response.json().then(data => {throw new Error(data.message)})
      } else {
        return response.json();
      }
    })
    .then(response => {
      setNotification("Welcome back "+ response.data.username);
      setUser(response.data);
    })
    .catch(error => {
      setNotification(error.message);
      setTimeout(()=>{
        setNotification(null);
      }, 6000);
    })
  }
  const logout = () => {
    fetch("http://localhost:5000/users/logout", {
      credentials: 'include'
    })
    .then(response => {

      if(response.status !== 200){
        return response.json().then(data => {throw new Error(data.message)})
      } else {
        return response.json();
      }
    })
    .then(response => {
      setUser(null);
      // document.cookie = "cookie.sid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
      setNotification(response.message);
    })
    .catch(error => {
      setNotification(error.message);
    })
  }

  useEffect(() => {
    setTimeout(()=>{
      setNotification(null);
    }, 6000);
  }, [notification]);

  useEffect(() => {
    fetch("http://localhost:5000/users/me",{
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "http://localhost:5000"
    })
    .then(response => {
      if(response.status !== 200){
        return response.json().then(data => {throw new Error(data.message)})
      } else {
        return response.json();
      }
    })
    .then(response => {
      console.log({response});
      setUser(response.data);
      setNotification(response.message);
    })
    .catch(error => {
      setUser(null);
    })
  }, []);

  return (
    <div className="App">
        {notification && <h2>{notification}</h2>}
        <button onClick={logout}> logout </button>  
        {user &&  
          <>
            <img src={user.avatar} alt="avatar" />
            <p>{user.username} - {user.email}</p>
          </>
        }


        <form ref={registerForm} onSubmit={register}>
          <input type="text" name="username" placeholder="username" />
          <input type="text" name="email" placeholder="email" />
          <input type="password" name="password" placeholder="password" />
          <button type="submit">register</button>
        </form>

        <form ref={loginForm} onSubmit={login}>
          <input type="text" name="email" placeholder="email" />
          <input type="password" name="password" placeholder="password" />
          <button type="submit">login</button>
        </form>

    </div>
  );
}

export default App;

