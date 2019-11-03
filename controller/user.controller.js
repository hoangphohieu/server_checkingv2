var express = require("express");
var router = express.Router();

//load model
userModel = require("../model/user.model");

router.get("/",async function (req, res) {
    let { _start, _end}=req.query;
    _start=parseInt(_start);
    _end = parseInt(_end);
    

    
    //filter exactly => return new_searchObj
    let searchObj = req.query;
    new_searchObj = {};
    for (var i = 0; i <= Object.keys(searchObj).length - 1; i++) {
        current_key = Object.keys(searchObj)[i];
        // console.log(current_key)
        if (current_key !== '_start' && current_key !== '_end'){
            new_searchObj[`item_post.${current_key}`] = searchObj[current_key];
        } 
        
    }
    // console.log(new_searchObj)



    try {
        //chua co limit
        var users = await userModel.find(new_searchObj, []);
        let Total_Count = users.length;
        // console.log(Total_Count)
        
        //them _start and _end
        var users = await userModel.find(new_searchObj, [], {
            skip: _start,
            limit: _end - _start,
        });

        users.push({ "total": Total_Count })
        res.send(users);

    } catch (err) { }

})
router.get("/sumitem", async function (req, res) {
    //filter exactly => return new_searchObj
    let searchObj = req.query;
    new_searchObj = {};
    for (var i = 0; i <= Object.keys(searchObj).length - 1; i++) {
        current_key = Object.keys(searchObj)[i];
        new_searchObj[`item_post.${current_key}`] = searchObj[current_key];
        
    }
    new_searchObj['item_post.datatype'] ='item'
    // console.log(new_searchObj)

    try {
        
        var users = await userModel.find(new_searchObj, []);
        

        
        res.send(users);

    } catch (err) { }

})


router.put("/:id", async function (req, res) {
    let { id } = req.params;

    //get ra user co id nhu vay
    var user;
    try {
        user = await userModel.findOne({ "item_post.id":id});
    } catch (err) {
        res.status(400).send("nothing user found");
        return;
    }

    //update gia tri vao object  user (vua tim ra ben tren)
    //field da co thi se duoc update //field chua co thi se duoc them moi
    person2 = req.body
    for (var i = 0; i <= Object.keys(person2['item_post']).length - 1; i++) {
        current_key = Object.keys(person2['item_post'])[i];
        // console.log(current_key)
        user['item_post'][current_key] = person2['item_post'][current_key];
    }
    

     try{
        // user.fullname = req.body.fullname;
        
        // save updated user
        // user = await user.save()

        //cau lenh update (cho nay eo hieu sao post thi dc)
         var new_user = new userModel(user)
         new_user = await new_user.save()

        res.send(user)
       
    }catch(err){
        
         res.send(err);
    }
    
    
    

})


router.delete("/:id", async function (req, res) {
    let { id } = req.params;
    //get ra user co id tuong uong
    var user;
    try {
        user = await userModel.findOne({'item_post.id':id});
    } catch (err) {
        res.status(400).send("nothing user found");
        return;
    }

    try{
        //xoa user bang mongoose
        user = await user.remove()
        res.send(user)
    }catch(err){
        res.send(err)
    }
    


})

router.post("/", async function (req, res) {
    //check item co chua (check id cua item ton tai ?)
    var old_user;
    try {
        old_user = await userModel.findOne({ 'item_post.id': req.body['item_post']['id'] });
    } catch (err) {
        res.send(err); 
        return;
    }
    
    if (old_user){
        res.send("id item exist!!"); return //ton tai id item => return, ko post
    } 
    

    // console.log(req.body)
    //input
	/*
	{"item_post":{
        "day": 1572714000000,
        "month": 12,
        "year": 2019,
        "product": "dress",
        "name": "#hm124",
        "datatype": "item",
        "basecost": 10.1,
        "lineitemquantity": 1,
        "id": "hm124luminousglowphonecaseiphonesamsungdah230816galaxys8",
        "partner": "userhm"
    }}


    */

    //vong lap post
    // for (let userPost of req.body) {
    try {
        var user = new userModel(req.body)
        user = await user.save()
        res.send(user)
    } catch (err) {
        res.send(err)
    }
    // }
    
    

    
})



module.exports = router;