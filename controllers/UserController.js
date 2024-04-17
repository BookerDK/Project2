class UserController{

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);//here is cathing the id of the form in the html
        this.tableEl = document.getElementById(tableId);//here is cathing the id of the table in the html

        this.onSubmit();//here you are loading the method onSubmit
    }

    onSubmit(){//this method is to create the event to send the form information

       this.formEl.addEventListener("submit", event =>{ //"=>" is arrowFunction //if you need more parameters you have to put "()" example: (event,somethingElse) =>

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");//here you are attaching the button of the html submit to a variable for use more than once 

            btn.disabled = true;//here you are disabling the button to avoid multiple sends 

            let values = this.getValues();//the attribute "let values" it is receiving the method getValues

            if(!values) return false;

            this.getPhoto().then(//the '.then' it is a promise, it attaches a callback
                (content)=>{//when you use "function()" you lost "this.", you have to use arrowFuction

                    values.photo = content;
                    this.addLine(values);

                    this.formEl.reset();
                    btn.disabled = false; //here you are activating againd the button submit


            }, (e)=>{
                    console.error(e);
            }
            );
    

               
        });

    }

    getPhoto(){ //new FileReader() alredy invokes the constructor method

        return new Promise((resolve, reject)=>{//Promise do, if everything goes well, it will do something if not, give a reject

            let fileReader = new FileReader();//the atrribute 'let fileReader' it is receiving the method API of FileReader()

            let elements = [...this.formEl.elements].filter(item=>{ //'...' it is the method spread, is like and an array
                if (item.name === "photo"){//if the name of the photo is equal to item.name, it will return item
                    return item;
                }
            });

            let file = elements[0].files[0]; //is saving into let file the positions of the array elements and files

            fileReader.onload = ()=>{
            
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) =>{

                reject(e);

            };

            if (file){
                fileReader.readAsDataURL(file);
             }else {
                resolve('dist/img/boxed-bg.jpg');
             }
        });

    }

    getValues(){

        let user = {};
        let isValid = true; //crate a variable to validate
        
        [...this.formEl.elements].forEach(function(field, index){ //method spread

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value ){//this if validate if the text name email and password are filled

                field.parentElement.classList.add('has-error');//you attribute the error to the parent element and its class 
                isValid = false;//here you change the variable to false
            }

            if(field.name == "gender"){
        
                if(field.checked){
                    
                    user[field.name] = field.value;
                }
                
        
            }else if(field.name =="admin"){

                user[field.name] = field.checked;

            }else{
        
                user[field.name] = field.value;
        
            }
    
        
        });
    
        if(!isValid){//if the form is incorrect, it will change the value of the variable to false, and return false to stop 
            return false;
        }

        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );


    }

    addLine(dataUser){
    
        let tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML =`
          <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin ? 'Sim' : 'Não')/*if ternary*/}</td> 
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;
            this.tableEl.appendChild(tr);

            this.updateCount();
            
    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++;
            let user = JSON.parse(tr.dataset.user);

            if(user.admin) numberAdmin++;
           
        });

       

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
        
    }
}    