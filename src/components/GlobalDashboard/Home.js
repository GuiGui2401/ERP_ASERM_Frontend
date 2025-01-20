import React from 'react'
import 
{ BsFillArchiveFill, BsPeopleFill, BsCurrencyExchange  }
 from 'react-icons/bs'
 import 
 {  XAxis, YAxis, Sector, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie } 
 from 'recharts';
 import Example from './Example';

function Home() {

    const data = [
        {
          name: 'Yaoundé',
          'Bénéfices': 40,
          'Chiffres d\'affaires': 8400,
          amt: 2400,
        },
        {
          name: 'Douala',
          'Bénéfices': 31,
          'Chiffres d\'affaires': 9398,
          amt: 2210,
        },
        {
          name: 'Buea',
          'Bénéfices': 3500,
          'Chiffres d\'affaires': 2800,
          amt: 2290,
        },
        {
          name: 'Kribi',
          'Bénéfices': 1000,
          'Chiffres d\'affaires': 3908,
          amt: 2000,
        },
        {
          name: 'Bafoussam',
          'Bénéfices': 1290,
          'Chiffres d\'affaires': 7800,
          amt: 2181,
        },
        {
          name: 'Garoua',
          'Bénéfices': 1500,
          'Chiffres d\'affaires': 5800,
          amt: 2500,
        },
        {
          name: 'Ebolowa',
          'Bénéfices': 1600,
          'Chiffres d\'affaires': 4300,
          amt: 2100,
        },
      ];

  return (
    <main className='main-container2'>
        <div className='main-title2'>
            <h3>TABLEAU DE BORD GENERAL</h3>
        </div>

        <div className='charts2'>
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={730} height={250} data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="Nombre de pharmacie" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
              <Area type="monotone" dataKey="Chiffres d'affaires" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
                <Example/>
            </ResponsiveContainer>

        </div>

        <div className='main-cards2'>
            <div className='card2'>
                <div className='card-inner2'>
                    <h3>DEPENSES DU MOIS</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1>8.325.500 XAF</h1>
            </div>
            <div className='card2'>
                <div className='card-inner2'>
                    <h3>BENEFICES ACTUELS</h3>
                    <BsCurrencyExchange   className='card_icon'/>
                </div>
                <h1>3.340.000 XAF</h1>
            </div>
            <div className='card2'>
                <div className='card-inner2'>
                    <h3>PERSONNEL EN MISSION</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>33</h1>
            </div>
        </div>
    </main>
  )
}

export default Home