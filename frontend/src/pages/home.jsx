import MessageArea from "../components/messageArea"
import SideBar from "../components/sideBar.jsx"
import getMessages from "../customHook/getMessages.js"


function Home(){
  getMessages()
return(
    <div className="w-full h-[100vh] flex">
      <SideBar/>
      <MessageArea/>
    
    </div>
)
}

export default Home
