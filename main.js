class EcommerceSystem {
   constructor(){
        this.security=new WeakMap()
        this.updateHistory=[];
        this.salesHistory=[];
        this.customerManagement={};
        this.transactions;
this.stock = {
     books: {
       textbooks: {
         math: { bp: 900, price: 1200, items: 3 },
         english: { bp: 1000, price: 2000, items: 40 },
         science: { bp: 700, price: 1300, items: 23 },
         geography: { bp: 600, price: 900, items: 14 }},
       setbooks: {
         kazuo: { bp: 400, price: 890, items: 50 },
         blossoms: { bp: 500, price: 900, items: 12 },
         dolls: { bp: 500, price: 860, items: 14 }
       }},
     clothes: {
       uniform: {
         tracksuit: { bp: 2000, price: 3000, items: 14 },
         scouts: { bp: 3000, price: 6000, items: 12 },
         stJohnsAmbulance: { bp: 7000, price: 12000, items: 13 }
       },
       urban: {
         cargo: { bp: 500, price: 1000, items: 15 },
         tshirt: { bp: 700, price: 1000, items: 13 },
         cup: { bp: 150, price: 500, items: 12 },
         ice: { bp: 1200, price: 2000, items: 15 }
       },
       official: {
         suit: { bp: 8000, price: 12000, items: 14 },
         blazer: { bp: 2000, price: 3000, items: 12 },
         trouser: { bp: 2000, price: 3300, items: 12 },
         tie: { bp: 12000, price: 2000, items: 13 }
       }},
     food: {
       drinks: {
         energy: { bp: 45, price: 65, items: 67 },
         coke: { bp: 30, price: 45, items: 56 },
         redBull: { bp: 100, price: 180, items: 23 },
         wine: { bp: 12000, price: 13400, items: 12 } }}}
 }
 //-----sales handler---------------------
 sell(cashier,items){
 let transactions={totals:0,items:[]}
 for (var i = 0; i < items.length; i++) {
   let found=this.findItem(items[i])
   if(found!==null){
   let{cluster,category,item}=found
     transactions['totals']+=item['price']
     transactions['items'].push(items[i])
     transactions['cashier']=cashier
     item['items']--
     } else {
       this.errorHandler(`${items[i]} not available`)}}
   this.transactions=transactions
   return this
 }
 //------customer handler---------------
customer(cash,name,id,pin){
if(cash>=this.transactions['totals']){
  let user=this.customerManagement;
  if(!user[id]){
        this.addNewCustomer(name,id,pin)
        return  this.receiptGen(name,cash)
  } else if (user) {
 if (this.customerManagement[id]['card'] == 'blocked') {
       this.blockedCardHandler(name,id)
     return  this.receiptGen(name,cash) }
 if(pin!==this.security.get(this)){
       let attempt=this.forgotPinHandler(name,id);
      return this.receiptGen(name,cash)
    }
       let point=this.transactions['totals']/100
         this.customerManagement[id]['points']+=point
       let message = document.getElementById('custom-alert')
       let button = document.getElementById('close-alert')
         message.classList = 'custom-alert'
         button.classList = ''
         showCustomAlert(`${name} earned ${point} points 🎉🎉`)
         this.receiptGen(name,cash)}
 } else {
  this.insufficientFundsHandler(name)
   }
   return this
 }
 //-----------receipt generator ----------
 receiptGen(name,cash){
      this.transactions['customer']=name;
      this.transactions['balance']=cash-this.transactions['totals']
      this.transactions['time']=this.now()
      this.salesUpdate(this.transactions)
      return this.transactions
 }
 errorHandler(message){
   alert(message)
 }
 forgotPinHandler(name,id){
   for (var i=0;i<3;i++) {
      let trial=prompt(`wrong pin!! you have ${3-i} trials left`)
      trial=Number(trial)
      if(trial==this.security.get(this)){
        let point = this.transactions['totals'] / 100
        this.customerManagement[id]['points'] += point
        return true
     }
  //this checks if the 3trials are over
  if((3-i)<=1){
       let message= document.getElementById('custom-alert')
       let button=document.getElementById('close-alert')
       message.classList='danger-alert'
       button.classList='danger-button'
        showCustomAlert('card blocked')
        this.customerManagement[id]['card']='blocked'
        showCustomAlert(`${name},CARD ID[${id}] BLOCKED`)
        this.updateCustomerInfo()
        return false
     }}}
 blockedCardHandler(name,id){
      let message = document.getElementById('custom-alert')
      let button = document.getElementById('close-alert')
      message.classList = 'danger-alert'
      button.classList = 'danger-button'
      showCustomAlert(`${name}:CARD[${id}] STILL BLOCKED`)
 }
 insufficientFundsHandler(name){
       let message= document.getElementById('custom-alert')
       let button=document.getElementById('close-alert')
       message.classList='danger-alert'
       button.classList='danger-button'
        showCustomAlert(`INSUFFICIENT FUNDS`)
  //below loop returns items in the stock if transaction is unsuccessful 
  for (var i = 0; i <this.transactions['items'].length; i++) {
  let _item=this.findItem(this.transactions['items'][i]) 
   let{cluster,category,item}=_item
   item['items']++
     } 
 }
 updateQuantity(items,quantity){
   let find=this.findItem(items)
   if(find){
    let {cluster,category,item}=find
    item['items']+=quantity
    this.stockUpdate(`${quantity} items of ${items} added successfully at:${this.now()}`)
    return this
   }
 return this 
 }
 updatePrice(_item,newPrice){
   let find=this.findItem(_item)
   if(find){
         let{cluster,category,item}=find
         this.stockUpdate(`${_item} price updated from ${item['price']} to ${newPrice} successfully at:${this.now()}`)
         item['price']=newPrice
    return this
   }
 return this
 }
 addNewItem(cluster,category,item,bp,price,quantity){
    if(!this.stock[cluster]){
      this.errorHandler(`${cluster} is an invalid cluster`)
      return }
    if(!this.stock[cluster][category]){
      this.errorHandler(`${category} is an invalid category`)
      return }
    if(this.stock[cluster][category][item]){
      this.errorHandler(`${item} already exist`)
      return}
    this.stock[cluster][category][item]={bp:bp,price:price,items:quantity}
    this.stockUpdate(`${item} added to ${category} in ${cluster} at ${this.now()}`)
 }
 removeItem(_item){
   let find=this.findItem(_item)
   if(find){
   let {cluster,category,item}=find
   delete this.stock[cluster][category][_item]
   this.stockUpdate(`${_item} deleted from ${cluster} in ${category} at ${this.now()}`)
   }
 }
 salesUpdate(message){
  this.salesHistory.push(message)
  this.updateSales()
 }
 stockUpdate(message){
  this.updateHistory.push(message)
  this.updateItemHistory()
  showNotification(message)
  this.updateInventoryReceipt()
 }
 findItem(item){
  let _item=null
  for (var cluster in this.stock) {
  for (var category in this.stock[cluster]) {
      if(this.stock[cluster][category][item]){
      _item=this.stock[cluster][category][item]
      return {cluster:cluster,category:category,item:_item}}}}
  if(_item==null){
       alert('item unavailable')
   return null
  }}
 now(){
   const now = new Date().toLocaleTimeString('en-GB',{day:'numeric',month:'numeric',year:'numeric',hour12:true,})
   return now
 }
 addNewCustomer(name,id,pin) {
   let user=this.customerManagement;
   if(!user[id]){
     let message = document.getElementById('custom-alert')
     let button = document.getElementById('close-alert')
     message.classList='custom-alert'
     button.classList = ''
   showCustomAlert(`${name} registered successfully`)
   user[id] = {}
   let _pin = this.security.set(this, pin)
   Object.assign(user[id], { name:name, id:id, points: 0, card: 'working' })
   this.updateCustomerInfo()
     return
   }
   this.errorHandler(`id number:${id},already exist`)}
  //------update customers eg.blocked----------
 updateCustomerInfo(){
   localStorage.setItem('customers',JSON.stringify(this.customerManagement))
 }
 //--------------update sales history -------------
 updateSales(){
   localStorage.setItem('sales_History',JSON.stringify(this.salesHistory))
 }
 //---update item update eg.remove item------------
 updateItemHistory(){
   localStorage.setItem('update_history',JSON.stringify(this.updateHistory))
 }
 //----------stock tracker-------------------
 stockTracker() {
   let s_tock = [];
   for (let cluster in this.stock) {
   for (let category in this.stock[cluster]) {
   for (let item in this.stock[cluster][category]) {
      const object = this.stock[cluster][category][item];
      let items ={item,cluster,category:category, available:object.items,price: object.price };
         s_tock.push(items);
       }}}
   return s_tock;
 }
 //---inventory receipt update----------------
  updateInventoryReceipt() {
        const inventoryOutput = document.getElementById('inventory-output');
        if (inventoryOutput) {
            inventoryOutput.textContent = this.getInventoryReceipt();
       }}
  getInventoryReceipt() {
   let receipt = '';
   for (let cluster in this.stock) {
   for (let category in this.stock[cluster]) {
   for (let item in this.stock[cluster][category]) {
   const { price, items } = this.stock[cluster][category][item];
   receipt += `${item} (${cluster} - ${category}): Price: $${price}, Available: ${items}\n`;
    }}}
        return receipt;
   }
}
let cashier=new EcommerceSystem()

//---loading animation ------
function showAnimation(param) {
  document.body.classList.toggle('loading')
  setTimeout(()=>{
    document.body.classList.toggle('loading')
  },2000)
}
//cashier page
let cashierPage=document.getElementById('sell-items-form');
if (cashierPage) {
  cashierPage.addEventListener('submit',function(e){
     e.preventDefault()
  let cashierName=document.getElementById('cashier').value
  let items=document.getElementById('items-to-sell').value.split(',')
  let customerCash=document.getElementById('customer-cash').value
  let customerName=document.getElementById('customer-name').value
  let customerId=document.getElementById('customer-id').value
  let customerPin=document.getElementById('customer-pin').value
  cashier.sell(cashierName,items).customer(customerCash,customerName,customerId,customerPin);
  cashierPage.reset();
  let receipt=document.getElementById('receipt-output')
  receipt.innerText =`Items:${cashier.transactions['items']},\nTotals:${cashier.transactions['totals']},\nBalance:${cashier.transactions['balance']},\nCashier:${cashier.transactions['cashier']},\nCustomer:${cashier.transactions['customer']},\ntime:${cashier.transactions['time']}`
  })  
}
//customer page
  let customerPage=document.getElementById('register-customer-form');
  if (customerPage) {
  customerPage.addEventListener('submit',function(e){
  e.preventDefault()
  let customerName=document.getElementById('customer-name').value
  let customerId=document.getElementById('customer-id').value
  let customerPin=document.getElementById('customer-pin').value
  cashier.addNewCustomer(customerName,customerId,customerPin);
  let customerData=document.getElementById('Existing-customer-list')
  user=cashier.customerManagement[customerId]
  let div=document.createElement('div')
  div.innerHTML=`<h3>card number:${customerId}</h3>`
  div.className='customers'
   for (var data in user) {
     let li=document.createElement('li')
     li.innerText=`${data}:${user[data]}`
     div.appendChild(li)
   customerData.appendChild(div)}
  customerpage.reset();
  })}
//------------------inventory page
//add new item
 const addNewItemForm=document.getElementById('add-item-form')
 if(addNewItemForm){
   addNewItemForm.addEventListener('submit',function(e){
     e.preventDefault()
     let item=document.getElementById('item-name').value
     let bp=document.getElementById('bp').value
     let price=document.getElementById('item-price').value
     let cluster=document.getElementById('item-cluster').value 
     let category=document.getElementById('item-category').value
     cashier.addNewItem(cluster,category,item,bp,price)
     addNewItemForm.reset();
   })}
//update item price
 const updateItemPriceForm = document.getElementById('update-price-form')
   if (updateItemPriceForm) {
     updateItemPriceForm.addEventListener('submit', function(e) {
       e.preventDefault()
       let item = document.getElementById('update-item-name').value
       let newPrice = document.getElementById('new-price').value
       cashier.updatePrice(item,newPrice)
       updateItemPriceForm.reset();
     })}
 //update item quantity
 const quantityForm=document.getElementById('update-item-quantity')
   if (quantityForm) {
   quantityForm.addEventListener('submit', function (e){
     e.preventDefault()
     let item=document.getElementById('update-quantity-item-name').value
     let quantity=document.getElementById('update-quantity-item-quantity').value
     cashier.updateQuantity(item,quantity)
     quantityForm.reset()
   })}
 //remove item
const removeItemForm=document.getElementById('remove-item-form')
if(removeItemForm){
  removeItemForm.addEventListener('submit', function(e){
    e.preventDefault()
    let item=document.getElementById('remove-item-name').value
    cashier.removeItem(item)
    removeItemForm.reset()
  })}
//clear local storage 
document.getElementById('clear-update-history').addEventListener('click',() => {
  let updateHistory = JSON.parse(localStorage.getItem('update_history'))
  let updateHistoryArea = document.getElementById('update-history-area')
  updateHistoryArea.innerText=''
  localStorage.removeItem('update_history')
});
document.getElementById('clear-sales-history').addEventListener('click',() => {
  let salesData=JSON.parse(localStorage.getItem('sales_History'))
  let salesHistoryArea = document.getElementById('sales-history-area')
  salesHistoryArea.innerText=''
  localStorage.removeItem('sales_History')
});
 //monitor stock
window.setInterval(history_uiupdate,2000)
//update the UI
function history_uiupdate(){
              //update customer form
  let updateHistoryArea=document.getElementById('update-history-area')
  let salesHistoryArea=document.getElementById('sales-history-area')
  let salesData=JSON.parse(localStorage.getItem('sales_History'))
  let updateHistory = JSON.parse(localStorage.getItem('update_history')) 
  if(salesHistoryArea){
    salesHistoryArea.innerText=''
    updateHistoryArea.innerText=''
     //-------- Load Product Update History
  if(salesData){
  //-----------Load Sales History
    for (let data of salesData) {
      let div = document.createElement('div')
      div.className = 'data'
  for (var credentials in data) {
      let li = document.createElement('li')
      li.innerText = `${credentials}:${data[credentials]}`
      div.appendChild(li)}
      salesHistoryArea.appendChild(div)
    }}
  //--update the items update history 
  if(updateHistory){
     for (var i = 0; i <updateHistory.length; i++) {
       let li=document.createElement('li')
       li.innerText=updateHistory[i]
       updateHistoryArea.appendChild(li)
     }}}}