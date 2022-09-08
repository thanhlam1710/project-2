import React from 'react'


// CSS
import '../../styles/home.css'
import { Chart } from './Chart'
import { Pievent } from './PieEvent'
import { PieFamily } from './PieFarmily'

const Home = () => {
  return (
    <div className='ant-layout-content site-layout-background'>
      <h1 className='container__title'>
        Thống kê
      </h1>
      <div className='container__chart'>
        <div className='chart'>
          <h2 className='chart__title'>Doanh thu</h2>
          <div className='chart__date'>
            <button>Tháng 4, 2021 <i className="fa-solid fa-calendar-days"></i></button>
          </div>
        </div>
        <Chart />
        <div className='chart__count'>
          <p className='count-title'>Tổng thu theo tuần</p>
          <p className='count-price'>525.145.000<span>đồng</span></p>
        </div>
      </div>
      <div className='container__pie'>
        <div className='chart__date'>
          <button>Tháng 4, 2021 <i className="fa-solid fa-calendar-days"></i></button>
        </div>
        <div className='pie-family'>
          <p>Gói gia đình</p>
          <PieFamily />
        </div>
        <div className='pie-event'>
          <p>Gói sự kiện</p>
          <Pievent />
        </div>
        <div className='pie-detail'>
          <div className='deital-use'>
            <div className='use-blue mr'></div>
            <span>Vé đã sử dụng</span>
          </div>
          <div className='deital-unuse'>
            <div className='use-red mr'></div>
            <span>Vé chưa sử dụng</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home