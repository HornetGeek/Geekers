document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector(".write").style.height = window.innerHeight - 400 +"px";
    
    
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', ()=>{
        socket.emit('joined');
        
        
        socket.emit('user online');
        

        
        document.querySelector("#form").onsubmit = ()=>{
            var massage = document.getElementById("massage").value;

            socket.emit('submit massage',massage);

            return false;}
        
        
        document.querySelector('#leave').addEventListener('click', ()=>{

            socket.emit('left');
            window.location.replace('/');

        });
       

    });

        
    
    socket.on("announce massage", data =>{
        Nmassage = `${data.user} :  ${data.massage}`;
        
        const div = document.createElement('div');

        div.classList.add("massage");
        div.innerHTML = Nmassage;
        
        document.querySelector("#chatArea").appendChild(div);
        document.getElementById("massage").value = '';


    });

    socket.on("status", data =>{
        msg = `${data.user} : ${data.msg}`;
        warning =  document.createElement('div');
        warning.classList.add('warning');
        warning.innerHTML = msg;
        document.querySelector("#chatArea").appendChild(warning);

    });

    socket.on("online", data=>{
        user_online = data.users; 
        
        ArrayNames = Object.keys(user_online);
        ArrayChaneel = Object.values(user_online);
        for (var i =0;i<ArrayChaneel.length;i++){
            if(data.chaneel != ArrayChaneel[i]){
                ArrayChaneel.splice(i);
                ArrayNames.splice(i);
            };
        };
        console.log(ArrayNames);
        console.log(ArrayChaneel);
        console.log("the chaneel of user =  "+data.chaneel);
        

        var listonline = document.querySelector('.users_online');
        listonline.classList.add("listionline")
        
        while(listonline.firstChild){
            listonline.removeChild(listonline.firstChild);
        };
        
        for (var i=0; i<ArrayNames.length;i++){
            var p = document.createElement('P');
            p.innerHTML = ArrayNames[i];
            listonline.appendChild(p);
        }

    });

    });
