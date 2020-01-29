document.addEventListener('DOMContentLoaded', ()=>{
    var req = new XMLHttpRequest();
        
    req.open('POST','http://fcih.helwan.edu.eg/transcript/AddNewUser2.php',true);
    req.withCredentials = true;
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("StudentName=%D9%85%D8%B9%D8%AA%D8%B2+%D9%85%D8%AD%D9%85%D9%88%D8%AF+%D8%B9%D8%A8%D8%AF+%D8%A7%D9%84%D9%85%D9%88%D8%AC%D9%88%D8%AF+%D9%85%D8%AD%D9%85%D9%88%D8%AF+%D8%A7%D8%AD%D9%85%D8%AF&EnglishFullName=moataz+mahmoudabd&SSN=20180613&Password=&Password2=&EmailAddress=mmoataz03%40gmail.com&OriginalEmailAddress=jhgjghgjm@gmail.com&Gender=m&MyDay=26&MyMonth=9&MyYear=2000&Telphone=01272011482&CellularPhone=01272011482&HomeAddress=%D8%A7%D9%84%D8%B3%D9%8A%D9%88%D9%81+%D8%B4%D9%85%D8%A7%D8%B9%D8%A9+%D8%B44+%D8%A7%D9%84%D8%A7%D8%B3%D9%83%D9%86%D8%AF%D8%B1%D9%8A%D8%A9&EmergencyContact=+mmoataz%40gmail.com");

    document.querySelector(".write").style.height = window.innerHeight - 400 +"px";
    
    
   $('#myModal').modal('show');
    
    var newuser = 0;
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', ()=>{
        
        socket.emit('joined');
        
        socket.emit('user online',newuser); 
        
        
        
        document.querySelector("#classmodal").onclick = ()=>{
            var newuser = document.getElementById("name").value;
            socket.emit("user online",newuser);
        };
        
        
        
        
        document.querySelector("#form").onsubmit = ()=>{
            let Mtime = new Date;
            Mtime = Mtime.toLocaleTimeString();
            var massage = document.getElementById("massage").value;
            socket.emit('submit massage',massage ,Mtime);
            return false;
        }
        
        
        document.querySelector('#leave').addEventListener('click', ()=>{

            socket.emit('left');
            window.location.replace('/');

        });
       

    });

        
    
    socket.on("announce massage", data =>{
        Nmassage = `${data.Mtime} :${data.user} :  ${data.massage}`;
        
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
