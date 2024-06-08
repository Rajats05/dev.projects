const inputslider=document.querySelector("[data-lengthslider]");
const lengthdisplay=document.querySelector("[data-length]");

const passworddisplay=document.querySelector("[data-passworddisplay]");

const copybtn=document.querySelector("[data-copy]");
const copymsg=document.querySelector("[data-copymsg]");

const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const symbolscheck=document.querySelector("#symbols");
const numberscheck=document.querySelector("#numbers");

const indicator=document.querySelector("[data-indicator]");

const generatebtn=document.querySelector(".generate-button");
const checkall=document.querySelectorAll("input[type=checkbox]");
const symbol="!@#$%^&*()+={[}]:;<>?/~";


let password="";
let passwordlength=10;
let checkcount=0;
handleslider();
  
setindicator("#ccc")


//this function helps us to change the slider value and slider display text value 
function handleslider(){
    inputslider.value=passwordlength;
    lengthdisplay.innerText=passwordlength;
    
}

function setindicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}


//to get random integar value
function getrand(min,max){
    return (Math.floor(Math.random()*(max-min))) + min; 
    //math.random() gives the random value between 0 to 1(excluding 1), in the above code suppose max=10,min=5 and math.random() gives 0.7
    //then 0.7(10-5)=3.5 but it will take floor value 3 + 5(min) value so the random value between 5 to 10 is 8.
}

//to get random integar
function randint(){
    return getrand(0,9);
}
//to get lowercase value
function randlower(){
    return String.fromCharCode(getrand(97,123));
}

function randupper(){
    return String.fromCharCode(getrand(65,91));
}

function randsymbol(){
    const randnum=getrand(0,symbol.length);
    return symbol.charAt(randnum);
}


//this function will calculate the dtrength through colors
function calcstrength(){
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;

    if(uppercasecheck.checked) hasupper=true;
    if(lowercasecheck.checked) haslower=true;
    if(symbolscheck.checked) hassym=true;
    if(numberscheck.checked) hasnum=true; 

    if(hasupper && haslower && (hasnum || hassym) && passwordlength>=8){
        return setindicator("green");
    }

    else if((hasupper || haslower) && (hasnum || hassym) && passwordlength>=6){
        return setindicator("orange");
    }

    else{
        return setindicator("red");
    }
}

//COPY PASSWORD FUNCTION 
//ASYNC FUNCTION ENSURES TO RETURN A PROMISE 
async function copycontent(){
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="copied";
    }
    catch(e){
        copymsg.innerText="failed";
    }
    //to make copy wala span 
    //when copy button is clicked then "active" class will be added and after 2 sec(2000ms) it will be removed  
    copymsg.classList.add("active");

    setTimeout(()=>{
        copymsg.classList.remove("active");
    },2000);
}


//whenever input slider is moved the passwordlength is updated and handleslider() function is called which changes the slider value in the UI
inputslider.addEventListener('input', (e)=>{
    passwordlength=e.target.value;
    handleslider(); 
});


//when the copybtn is clicked, it checks if the "passwordisplay.value" has any value if yes then 
//call the copycontent() to copy the password 
copybtn.addEventListener('click',()=>{
    if(passworddisplay.value){
        copycontent();
    }
})


//this function will count the no. of checkboxes checked 
function handlecheckbox(){
    checkcount=0;
    checkall.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    });
    //it is not possible to have checkcount more than passwordlength because if 3 checkboxes are checked then the passwordlength should
    //have atleast 3 characters
    if(passwordlength<checkcount){
        passwordlength=checkcount; 
        handleslider();    //whenever passwordlength is changed handleslider funcion is called to update the slider in UI 
    }
}


//whenever there is any change in check button i.e either checked or unchecked it will call handlecheckbox function which will basically
//count the no of box checked 
checkall.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckbox);
})




function shufflepassword(array){
    //fisher yates method
    for(let i=array.length-1;i>0;i--){
        //j will have the random index
        const j=Math.floor(Math.random()*(i+1));

        //swapping
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str="";
    array.forEach((alpha)=>{    //array will be again converted to string 
        str+=alpha;
    });
    return str;
}


//generating the randowm password
generatebtn.addEventListener('click',()=>{
    //if none of the check boxes are checked then the function will be returned empty
    if(checkcount==0){
        return;
    }

    //if passwordlength is smaller than checkcount then passwordlength will be equal to checkcount and "handleslider()" will be called 
    //to update the slider in UI
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();
    }

    //now the below codes will generate the random password 

    //first of all remove the old password so set password string empty
    password="";
    let funcarr=[];

    //Now "funcarr" will be pushed with function which are checked 

    if(uppercasecheck.checked){
        funcarr.push(randupper);
    }

    if(lowercasecheck.checked){
        funcarr.push(randlower);
    }

    if(numberscheck.checked){
        funcarr.push(randint);
    }

    if(symbolscheck.checked){
        funcarr.push(randsymbol);
    }

    //now suppose two boxes are checked "symbols" and "lowercase" and the length of password chosen is 10 then, "funcarr" will contain 
    //two functions "symbols()" and "lowercase()" as a function.
    //it is compulsory to atleast add two character from "symbols" and "lowercase" each and remaining characters would be random.

    //suppose 2 checkboxes are selected then length of "funcarr" will be 2 and those two character will be added to "password" in below function 
    for(let i=0;i<funcarr.length;i++){
        password+=funcarr[i]();     //suppose i=0 and funcarr[0] is "randsymbol" then funcarr[i]() = randsymbol() function will be called 
    }

    //adding the remaining random characters
    for(let i=0;i<passwordlength-funcarr.length;i++){
        let randindex=getrand(0,funcarr.length); //suppose funcarr.length() is 2 then "randindex" will contain either 0 or 1 
        password+=funcarr[randindex](); 
    }

    //shuffling the password
    password=shufflepassword(Array.from(password)); //password in string is converted to array 

    //now displaying the password 
    passworddisplay.value=password;
    calcstrength();
});


