import React,{createRef} from 'react';
import Navbar from '../Navbar/index';
import './style.css';
import DatePicker from 'react-date-picker'
// import 'react-datetime/css/react-datetime.css';
import axios from 'axios';


export default class Home extends React.Component{
    
    
    constructor(props){
        super(props);
        if(localStorage.getItem('token')===null){
            this.props.history.push('/login')
        }
        this.amount_type = createRef();
        this.amount = createRef();
        this.division = createRef();
        this.category = createRef();
        this.dateref = createRef();
        this.desc = createRef();
        this.type = createRef();
        this.curr_desc = -1;
        this.state = { months : [ {month:'January',total:0, totalExpense: 0, totalIncome:0, highestIncome:0 },
                                        {month:'February',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'March',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'April',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'May',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'June',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'July',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'August',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'September',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'October',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'November',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                        {month:'December',total:0, totalExpense: 0, totalIncome:0, highestIncome:0} ],
                        typeState : "month", year : new Date(), month : new Date(), yearly_report : [], report : [],
                        phoneView : false, isResponse: false 

                         }

    }
    
   
    handleResize = ()=> {
        
        const { innerWidth: width} = window;
        if(width<=768){
            this.setState({phoneView: true});
        }
        else{
            this.setState({ phoneView: false});
        }
    }

    
    componentDidMount(){
        this.getData(this.state.year, this.state.month);
        this.handleResize();
        this.type.current.addEventListener("change",this.handleChange);
        window.addEventListener('resize', this.handleResize);

    }


    handleChange = () =>{
        this.setState({typeState:this.type.current.value});  
        
        this.getData(this.state.year, this.state.month);
    }


    
    closeCollapse = (i)=>{
        if(this.curr_desc !== -1 && this.state.phoneView)
            document.getElementById("collapse"+this.curr_desc).className = "collapse";
        this.curr_desc = i;
    }


    getData = async (year,month)=>{
        this.setState({isResponse: false});
        let date;
        if(this.state.typeState==="month"){
            date = new Date(month);
            
        }
        else{
            date = new Date(year);
        }
        let res = await axios.get("http://localhost:5000/getTransaction/"+date.getFullYear()+"/"+date.getMonth()+"/"+this.state.typeState,{
            headers:{ authorization: localStorage.getItem('token')}
        });
        if(this.state.typeState === "month"){
            this.setState({isResponse: true})
           
            this.setState({report: res.data});
            
        }
        else{
            let data = [ [], [], [], [], [], [], [], [], [], [], [], []];
            let temp_months = [ {month:'January',total:0, totalExpense: 0, totalIncome:0, highestIncome:0 },
                                {month:'February',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'March',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'April',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'May',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'June',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'July',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'August',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'September',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'October',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'November',total:0, totalExpense: 0, totalIncome:0, highestIncome:0},
                                {month:'December',total:0, totalExpense: 0, totalIncome:0, highestIncome:0} ]
            res.data.forEach(element => {
                let m = new Date(element.date).getMonth()
                data[m].push(element);
                if(element.type ==="income"){
                    temp_months[m].total += Number(element.amount);
                    temp_months[m].totalIncome += Number(element.amount);
                    if(Number(element.amount) > temp_months[m].highestIncome)
                        temp_months[m].highestIncome = Number(element.amount);
                }
                else{
                    temp_months[m].total -= Number(element.amount);
                    temp_months[m].totalExpense += Number(element.amount);
                }

            });
            this.setState({ months: temp_months, yearly_report: data});
            this.setState({isResponse:true});
     
        }
        
    }

    addData = async ()=>{
        let transaction = {
            type : this.amount_type.current.value,
            amount : this.amount.current.value,
            division : this.division.current.value,
            category : this.category.current.value,
            date : this.dateref.current.value,
            description : this.desc.current.value
        }
        if(transaction.amount === "" || transaction.category === ""){
            alert("Fill amount and category");
            return;
        }
        await axios.put("http://localhost:5000/addTransaction",transaction,{
            headers:{ authorization: localStorage.getItem('token')}
        });
        this.getData(this.state.year, this.state.month);
        this.amount_type.current.value="";
        this.amount.current.value="";
        this.division.current.value="";
        this.category.current.value="";
        this.dateref.current.value="";
        this.desc.current.value="";
       
    }

    
    render(){
        return (
            <>
                <Navbar />
                <div className="container-fluid bg-dark py-5" style={{minHeight:"91vh"}}>
                    <div id="home-container" className="container p-4 p-md-5">
                        <h1 style={{marginTop:"-20px",marginBottom:"20px", fontFamily:"segio print"}}>Hello {localStorage.getItem('user')}</h1>
                        <div className="input-group mb-4 row" >

                                <span className="input-group-text bg-dark p-2 col-auto" style={{ color:"white"}}><b>Show Report :</b></span>
                                <select ref={this.type} defaultValue="month" className="form-select col-auto" style={{paddingLeft:"20px", paddingRight:"20px" }}>
                                        <option value="month">Montly</option>
                                        <option value="year">Yearly</option>
                                </select>
                                <div className="col-sm-1 col-md-3 col-lg-5"></div>
                                <button type="button" className="btn btn-block btn-outline-success col-auto mt-3 mt-sm-0" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Add Transaction
                                </button>

                        </div>

                        <DatePicker 
                            format={this.state.typeState==="month" ? "MM-y" : "y"}
                            onChange={(value)=>{ 
                                if(this.state.typeState==="month"){
                                    this.setState({month: value});
                                } 
                                else
                                { 
                                    this.setState({year: value});
                                } 
                            this.getData(value,value)}
                            }
                            value={this.state.typeState==="month" ? this.state.month : this.state.year}
                            maxDetail={this.state.typeState==="month" ? "year" : "decade"}
                            clearIcon={null}
                            monthPlaceholder=""
                            yearPlaceholder=""
                            className="yearPicker"
                            
                        />


                        { this.state.typeState==="month" && <table className="table table-sm table-hover">
                            <thead>
                                <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Transaction</th>
                                <th scope="col">Amount</th>
                                {!this.state.phoneView && <th scope="col">Division</th> }
                                {!this.state.phoneView && <th scope="col">Category</th>}
                                {!this.state.phoneView && <th scope="col">Description</th>}
                                </tr>
                            </thead>
                            
                            <tbody>
                                {this.state.isResponse && this.state.report.map((a,index)=>{
                                    let d = new Date(a.date);
                                    let year = d.getFullYear();
                                    let month = d.getMonth()+1;
                                    let date = d.getDate();
                                    let str = date+"/"+month+"/"+year;
                                    return(
                                        <React.Fragment key={index}>
                                        
                                        <tr onClick={()=>{this.closeCollapse(index)}} data-bs-toggle="collapse" data-bs-target={"#collapse"+index}>
                                            <th scope="row">{str}</th>
                                            <td>{a.type}</td>
                                            <td>{a.amount}</td>
                                            { !this.state.phoneView && <td>{a.division}</td> }
                                            { !this.state.phoneView && <td>{a.category}</td> }
                                            { !this.state.phoneView && <td>{a.description}</td> }
                                        </tr>
                                        {this.state.phoneView && <tr className="collapse" id={"collapse"+index}>

                                            <td className="desc p-3" colSpan="6">
                                                <p><b>Category : </b>{a.category}</p>
                                            <p><b>Description : </b>{a.description}</p>
                                            </td>
                                        </tr>}

                                    </React.Fragment>
                                    )
                                })}
                                
                            </tbody>
                        </table>
                        }  

                        { !this.state.isResponse && 

                                <div className="d-flex justify-content-center mt-3">
                                    <div className="spinner-grow spinner-grow-sm" role="status" >
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div className="spinner-grow spinner-grow-sm" role="status" style={{marginLeft:"7px"}}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div className="spinner-grow spinner-grow-sm" role="status" style={{marginLeft:"7px"}}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>

                        } 

                        { this.state.typeState==="year" && <div className="row" style={{justifyContent:"space-around"}}>
                            { this.state.isResponse && <p style={{ color:"gray", textAlign:"right"}}> Click the cards for more details </p> }
                            { this.state.isResponse && this.state.months.map((item,index) => (

                                <div key={index} onClick={()=>{ 
                                                    let d = new Date(this.state.year.getFullYear(),index);
                                                    this.setState({month:d});
                                                    this.type.current.value = "month";
                                                    this.setState({typeState: "month"}, ()=>{ this.getData(this.state.year,this.state.month); });        
                                                    }} 
                                    className="card col-md-5 col-10 pt-2" style={{marginBottom:"20px", border: "2px solid grey", cursor:"pointer"}}>
                                    <div className="card-title"><h5><b>{item.month}</b></h5></div>
                                    <div className="card-body" style={{lineHeight:"1"}}>
                                        <p><b>Total - </b>{item.total}</p>
                                        <p><b>Total Income - </b>{item.totalIncome}</p>
                                        <p><b>Total Expense - </b>{item.totalExpense}</p>
                                        <p><b>Highest Income - </b>{item.highestIncome}</p>
                                        
                                    </div>
                                </div>  
                            ))}
                            
                        </div>

                        }
                        

                    </div>
                </div>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">New Transaction</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text px-4 bg-dark text-white" >Type</span>
                                <select ref={this.amount_type} defaultValue="income" className="form-select" aria-label="Default select example">
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div className="form-floating mb-3">
                                <input ref={this.amount} type="number" className="form-control" id="amount" />
                                <label htmlFor="amount">Amount</label>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text px-4 bg-dark text-white" >Division</span>
                                <select ref={this.division} defaultValue="office" className="form-select" aria-label="Default select example">
                                    <option value="office">Office</option>
                                    <option value="personal">Personal</option>
                                </select>
                            </div>
                            <div className="form-floating mb-3">
                                <input ref={this.category} type="text" className="form-control" id="category" />
                                <label htmlFor="category">Category</label>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="datepicker" className="form-label mt-2"><b>Due date</b></label>
                                <input type="date" ref={this.dateref} id="datepicker" className="form-control" ></input>
                            </div>
                            <div className="form-floating mb-3">
                                <textarea ref={this.desc} type="text" className="form-control" id="desc" style={{height:"100px"}}></textarea>
                                <label htmlFor="desc">Description</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-success " data-bs-dismiss="modal" onClick={this.addData}>Add</button>
                        </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}