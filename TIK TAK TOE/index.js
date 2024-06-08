const boxes=document.querySelectorAll(".box");
const gameinfo=document.querySelector(".game-info");
const newgamebtn= document.querySelector(".btn");


let currentplayer;
let gamegrid;

//these are the bundle of indexes which are winning positions
const winningpositions=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
];


//function to initialise the game(at first what should be shown in UI)

function initgame(){
    currentplayer="X";
    gamegrid=["","","","","","","","",""];

    //After coutering initgame() function the UI should be cleaned to original
    boxes.forEach((box,index)=>{
        box.innerText="";

        boxes[index].style.pointerEvents="all";
        //after the game is finished we need to remove the green color in the boxes which declared the winner
        //to do this initialize boxes with initial class so that they get their original css
        box.classList=`box box${index+1}`;
    });
    newgamebtn.classList.remove("active");
    gameinfo.innerText=`Current Player - ${currentplayer}`;

}

initgame();

function checkgameover(){
    
    newgamebtn.classList.add("active");  //this will make new game button visible 

    let answer="";

    winningpositions.forEach((position)=>{
        
        //all 3 boxes sould be non-empty as well exactly same in value : : position[0] gives the winning index
        if((gamegrid[position[0]] !=="" || gamegrid[position[1]] !=="" || gamegrid[position[2]] !=="")
            && ((gamegrid[position[0]]===gamegrid[position[1]]) && (gamegrid[position[1]] === gamegrid[position[2]]))){
            
                //if the above condition is fulfilled means someone has won
                //since winner will have all 0,1,2 index as same value so checking for 0th index as e.g.
                if(gamegrid[position[0]]==="X"){
                    answer="X";
                }
                else{
                    answer="O";
                }

                //when we know the winner then we disable the pointer event so that the game do not proceed 
                boxes.forEach((box)=>{
                    box.style.pointerEvents="none";
                })
                //making the common boxes green to declare winner
                boxes[position[0]].classList.add("win");
                boxes[position[1]].classList.add("win");
                boxes[position[2]].classList.add("win");
             
        }
           
    });

    if(answer!==""){
        gameinfo.innerText=`Winner Player - ${answer}`;
        return;
    }


    //when the function is not returned till here then it means there is no winner 
    
    let fillcount=0;
    gamegrid.forEach((box)=>{
        if(box!==""){          //if every box is non-empty and no one is winner so the game is tied
            fillcount++;
        }
    });
    
    if(fillcount===9){
        gameinfo.innerText="Game Tied!";
    }
    

}

function swapturn(){
    if(currentplayer==="X"){
        currentplayer="O";
    }
    else{
        currentplayer="X";
    } 

    //UI Update
    gameinfo.innerText=`Current Player- ${currentplayer}`;
}


function handleclick(index){
    if(gamegrid[index]===""){
        boxes[index].innerText=currentplayer;  //this is to show on UI
        gamegrid[index]=currentplayer;         //this is for beckend use 
        
        //swap the turn
        swapturn();
        //check if won the game
        checkgameover();
    }
}


//adding event listeners to each boxes 
boxes.forEach((box,index)=>{
    box.addEventListener("click",()=>{
        handleclick(index);
    })
});

newgamebtn.addEventListener("click",initgame);