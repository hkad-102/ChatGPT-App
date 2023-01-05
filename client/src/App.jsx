import { useState, useEffect } from 'react'
import axios from 'axios'
import Send from './assets/send.svg'
import User from './assets/user.png'
import Loader from './assets/loader.svg'
import Bot from './assets/bot.png'

function App() {
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([])


  useEffect(() => {
    document.querySelector('.layout').scrollTop = document.querySelector('.layout').scrollHeight;
  },[posts])
  const fetchBotResponse = async () => {
    const { data } = await axios.post("http://localhost:4000", {input}, {
      headers: {
        "Content-Type": 'application/json'
      }
    });
    return data
  }

  // let arr = [
  //   {type: 'user', post: 'faffasderssdf'},
  //   {type: 'bot', post: 'restdwerasd'}
  // ]

  const onSubmit = () => {
    if(input.trim() === '') return;
    updatePosts(input);
    updatePosts("loading...", false, true);
    setInput('')
    fetchBotResponse().then((res) => {
      console.log(res);
      updatePosts(res.bot.trim(), true);
    });
  }

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if(index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if(lastItem.type !== 'bot'){
            prevState.push({
              type: 'bot',
              post: text.charAt(index - 1)
            })
          } else {
            prevState.push({
              type: 'bot',
              post: lastItem.post + text.charAt(index - 1)
            })
          }
          return [...prevState];
        })
        index++;
      }else{
        clearInterval(interval)
      }
    }, 30)
  }

  const updatePosts = (post, isBot, isLoading) => {
    if(isBot) {
      autoTypingBotResponse(post);
    }else{
      setPosts(prevState => {
        return [
          ...prevState,
          {type: isLoading ? 'loading' : 'user', post}
        ]
      })

    }

  }

  const onKeyUp = (e) => {
    //the code of enter key is 13 so we make sure that we have choosen the right key
    if(e.key === 'Enter' || e.which === '13'){
      onSubmit();
    }
  }

  return (
    <main className="chatGPT-app">
      <section className='chat-container'>
        <div className="layout">
          {posts.map((post, index) => {
            return (
              <div className={`chat-bubble ${post.type === 'bot' || post.type === 'loading' ? 'bot' : ''}`} key={index}>
                <div className="avatar">
                  <img src={post.type === 'bot' || post.type === 'loading' ? Bot : User} alt="" />
                </div>
                {post.type === 'loading' ? (
                  <div className="loader">
                    <img src={Loader} alt="" />
                  </div>
                ) : (
                  <div className="post">
                    {post.post}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
      <footer>
        <input type="text" value={input} className='composebar' autoFocus placeholder='Ask Anything! Test my ability..' onChange={(e) => setInput(e.target.value)} onKeyUp={onKeyUp} />
        <div className="send-button" onSubmit={onSubmit}>
          <img src={Send} alt="" />
        </div>
      </footer>
    </main>
  )
}

export default App
