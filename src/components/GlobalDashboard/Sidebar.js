import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill}
 from 'react-icons/bs'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3  className='icon_header'/> Logo
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div><br/><br/><br/><br/><br/>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="/dashboard">
                    <BsGrid1X2Fill className='icon'/> MODULE SUPPLY CHAIN
                </a>
            </li><br/><br/>
            <li className='sidebar-list-item'>
                <a href="/salelist">
                    <BsFillArchiveFill className='icon'/> MODULE VENTE
                </a>
            </li><br/><br/>
            <li className='sidebar-list-item'>
                <a href="/admin/dashboard">
                    <BsFillGrid3X3GapFill className='icon'/> MODULE RH
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar