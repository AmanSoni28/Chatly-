import MessageArea from "../components/messageArea"
import SideBar from "../components/sideBar.jsx"
import useGetMessages from "../customHook/getMessages.js"
import getMessages from "../customHook/getMessages.js"


function Home(){
useGetMessages()
return(
    <div className="w-full h-[100vh] flex">
      <SideBar/>
      <MessageArea/>
    
    </div>
)
}

export default Home
