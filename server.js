const express = require("express");
const reqIP = require("request-ip");
const useragent = require("useragent");
const accepts = require("accepts");
const path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(reqIP.mw());

app.use((req,res,next)=>{
    var IP = req.clientIp;
    res.locals.IP = IP;
    next();
});

app.use((req,res,next)=>{
    var agent = useragent.parse(req.headers['user-agent']);
    res.locals.agent = agent.toString();
    next();
});

app.use((req,res,next)=>{
    var lang = accepts(req).languages();
    res.locals.lang = lang;
    next();
});

app.get('/api/whoami/', (req,res)=>{
    var ip = res.locals.IP;
    var software = res.locals.agent;
    var lang = res.locals.lang;
    
    res.json({
        ipaddress: ip,
        language: lang[0],
        software: software
    });
    res.end();
});

var listener = app.listen(process.env.PORT, function(){
   console.log('Your app is listening on port '+listener.address().port); 
});