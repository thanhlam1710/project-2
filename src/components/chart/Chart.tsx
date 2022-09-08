import { Area } from '@ant-design/plots';

export const Chart = () => {
  const DemoArea = () => {
    const data = [
        {
            "timePeriod": "Thứ 2",
            "Doanh thu": '140 triệu'
        },
        {
            "timePeriod": "Thứ 3",
            "Doanh thu": '180 triệu'
        },
        {
            "timePeriod": "Thứ 4",
            "Doanh thu": '140 triệu'
        },
        {
            "timePeriod": "Thứ 5",
            "Doanh thu": '210 triệu'
        },
        {
            "timePeriod": "Thứ 6",
            "Doanh thu": '210 triệu'
        },
        {
            "timePeriod": "Thứ 7",
            "Doanh thu": '200 triệu'
        },
        {
            "timePeriod": "CN",
            "Doanh thu": '140 triệu'
        },
        
    
    ];

    const config = {
        data,
        xField: 'timePeriod',
        yField: 'Doanh thu',
        xAxis: {
            range: [0, 1],
        },
        line: {
            color: '#FF993C',
            size: 4,
            height: 400,
        },
        areaStyle: () => {
            return {
                fill: 'l(270) 0:#ffffff 0.5:rgb(255 153 60 / 79%) 1:#FF993C',
                height: 400,
            };
        },
    };

    return <Area {...config} />;
};
    return (
        <>
          <DemoArea />
        </>
    )
    
    
}