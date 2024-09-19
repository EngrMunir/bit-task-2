import './report.css'
const Report = ({report}) => {
    const reportData = report?.reportData || [];
    const grossTotals = report?.grossTotals || {};
    console.log(reportData)
    console.log(grossTotals)
    return (
        <table className='table'>
            <thead>
                <tr>
                <th>Product Name</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                </tr>
            </thead>
            <tbody>
               { 
                 reportData.map((item,index)=> (
                    <tr key={index}>
                        <td>{item.product_name}</td>
                        <td>{item.name}</td>
                        <td>{item.user_phone}</td>
                        <td>{item.purchase_quantity}</td>
                        <td>{item.product_price}</td>
                        <td>{item.Total}</td>
                    </tr>
))}
                    <tr>
                        <td colSpan={3} className='text-center'>Gross Total:</td>
                        <td>{grossTotals.grossPurchaseQuantity}</td>
                        <td>{grossTotals.grossProductPrice}</td>
                        <td>{grossTotals.grossTotal}</td>
                    </tr>
            </tbody>
            
        </table>
    );
};

export default Report;