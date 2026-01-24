const express = require("express");
const router = express.Router();
const Student = require("../models/Student.js");


// let eucliDistance = (a, b)=>
// {
//     return Math.sqrt(a.reduce((sum, val, i)=>
//     {
//         return sum + Math.pow(val - b[i], 2);
//     }, 0));
// }
let eucliDistance = (a, b)=>
{
    let sum = 0; 
    console.log("a",a);
    console.log("b",b);
    for(let i=0; i<a.length; i++)
    {
        let sq = Math.pow(a[i] - b[i], 2);
        console.log("sq",sq);
        sum = sum + sq;
    }

    let sqrt = Math.sqrt(sum);
    console.log("sqrt:",sqrt);
    return sqrt;
    // if(sqrt < 0.7)
    // {
    //     return true;
    // }
    // return false;
}

let distance = (lat1, log1, lat2, log2)=>
{
    let sq1 = Math.pow((lat1 - lat2), 2);
    let sq2 = Math.pow((log1 - log2), 2);
    let sqrt = Math.sqrt(sq1 + sq2);
    return sqrt;
}

router.route("/sendFaceDescriptor")
.post(async(req, res)=>
{
    console.log(req.body);
    let {faceDescriptor, rollno, lat, log} = req.body;
    console.log(faceDescriptor, rollno);
    // console.log("hi",JSON.parse(faceDescriptor))

    let code  = await Student.findOne({rollno: rollno});
    // console.log(code);
    // console.log(code.faceDescriptorCode[0]);
    if(code)
    {
        // eucliDis
        // let dist = eucliDistance(JSON.parse(code.faceDescriptorCode[0]), JSON.parse(faceDescriptor));
        let dist = eucliDistance(JSON.parse(code.faceDescriptorCode[0]), (faceDescriptor));
        let nearBy =  distance(code.lat, code.log, lat, log);   
        console.log("nearby", nearBy);
        console.log("dist",dist);
        // if(dist <= 0.7 && nearBy <= 1.5)
        if(dist <= 0.7 )
        {
            console.log("okok")
            // return res.send("okok")
            let id = code.id;
            let update = await Student.findByIdAndUpdate(id, {attendance: code.attendance+1});
            console.log("update: ",update);
            res.status(200).json({msg: "yess"});
        }

        // if(code.faceDescriptor === faceDescriptor)
        // {
        //     res.status.json({msg: "yess"});
        // }
        else
        {
            res.status(401).json({msg: "no"})
            // res.send("nono")
        }
    }
    else
    {
        res.status(401).json({msg: "no"});
    }
    // res.send("kk");
});



module.exports = router;