import axios from "axios";
import { useState } from "react";
import Report from "./components/report";

const Home = () => {
    const [data, setData]=useState([]);
    const [report, setReport] = useState([]);

    const handleGenerate=async()=>{
       axios.get('https://raw.githubusercontent.com/Bit-Code-Technologies/mockapi/main/purchase.json')
       .then(res =>setData(res.data))

       if(data){
        const res = await fetch('http://localhost:8081/store-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if(res.status==200){
            axios.get('http://localhost:8081/report-data')
            .then(res =>{
                console.log(res.data.reportData)
                setReport(res.data)
            })
          }
       }
    }
    return (
        <div className='h-screen grid justify-items-center items-center'>
            <button onClick={handleGenerate} className='btn bg-green-500 px-4 py-2 rounded'>Generate Report</button>
            <div>
                {
                report && <Report report={report}/>
                }
            </div>
        </div>
    );
};

export default Home;