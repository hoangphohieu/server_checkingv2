var express = require("express");
var router = express.Router();

//load model
userModel = require("../model/user.model");

router.get("/",async function (req, res) {
    // console.log(req.user);
    let { _start, _end, _sort, _order, searchName, q}=req.query;
    _start=parseInt(_start);
    _end = parseInt(_end);

    let sortObj={};
    sortObj[_sort] = (_order === "DESC" ? -1 : 1);

    //& q=nghiahsgs & searchName=fullname
    let searchObj={};
    if (searchName){
        searchObj[searchName] = q;
    }
    
    try {
        //chua co limit
        var users_length = await userModel.find(searchObj, [], {
            sort: sortObj
        });

        var users = await userModel.find(searchObj, [], {
            skip: _start,
            limit: _end - _start,
            sort: sortObj
        });
        users = users.map(user => {
            return { id: user._doc._id, ...user._doc }
        })

        //console.log(users)
        res.header({ 'X-Total-Count': users_length.length }).send(users); 

    } catch (err) { }

})

//get specific user
router.get("/:_id", async function (req, res) {
    // console.log(req.params);
    let { _id } = req.params;
    var user;
    try {
        

        user = await userModel.findOne({_id});
        
        //res.header({ 'X-Total-Count': users_length.length }).send(users);

    } catch (err) { console.log(err)}

    if(!user){
        return res.status(400).send("not found user")
    }
    user = { id: user._doc._id, ...user._doc }
    res.send(user)


})

router.put("/:_id", async function (req, res) {
    // console.log(req.params);
    let { _id } = req.params;

    var user;
    try {
        user = await userModel.findOne({ _id});
    } catch (err) {
        res.status(400).send("nothing user found");
        return;
    }

    try{
        //sua chinh minh hoac sua nguoi khac neu ban la admin
        // console.log(req.user._id === user._id)
        // console.log(req.user.isAdmin === true)
        if ((req.user._id).toString() === (user._id).toString() || req.user.isAdmin===true) {

            user.fullname = req.body.fullname;
            user.username = req.body.username;
            user.password = req.body.password;
            user.isAdmin = req.body.isAdmin;

            user = await user.save()
            user = { id: user._doc._id, ...user._doc }
            res.send(user)
        }else{
            res.status(400).send("need permission");
        }
    }catch(err){
        res.status(400).send(err);
    }
    
    
    

})


router.delete("/:_id", async function (req, res) {
    // console.log(req.params);
    let { _id } = req.params;
    try {
        var user = await userModel.findOne({ _id});
    } catch (err) {
        res.status(400).send("nothing user found");
        return;
    }
    user = await user.remove()
    
    user = { id: user._doc._id, ...user._doc }
    res.send(user)


})

router.post("/", async function (req, res) {
    // console.log(req.body)
    //input
	/*
	{
	"fullname":"nguyen ba nghia",
	"username":"nghiahsgs",
	"password":"261997"
	}
    */
   console.log(req.body)
    // for (let userPost of req.body) {
        try {
            var user = new userModel(req.body)
            user = await user.save()
            user = { id: user._doc._id, ...user._doc }
            res.send(user)
        } catch (err) {
            res.send(err)
        }    
    // }

    
})



module.exports = router;