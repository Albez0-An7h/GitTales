import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import NameList from './Components/NameList.jsx'
import PersonData from './Components/PersonData.jsx'
import Page_404 from './Components/Page_404.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <NameList/>,
    errorElement: <Page_404/>
  },
  {
    path: '/PullRequestData/:username',
    element: <PersonData />
  }
])

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
