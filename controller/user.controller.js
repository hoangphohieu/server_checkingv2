var express = require("express");
var router = express.Router();

//load model
userModel = require("../model/user.model");

router.get("/", async function (req, res) {
    let { _start, _end } = req.query;
    _start = parseInt(_start);
    _end = parseInt(_end);
    let searchObj = req.query;
    new_searchObj = {};
    for (var i = 0; i <= Object.keys(searchObj).length - 1; i++) {
        current_key = Object.keys(searchObj)[i];
        if (current_key !== '_start' && current_key !== '_end') {
            new_searchObj[`item_post.${current_key}`] = searchObj[current_key];
        }
    }
    console.log(new_searchObj)
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
    try {
        var users = await userModel.find(new_searchObj, []);
        //=start=xu ly ra ket qua summary
        var json_response = {};
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            current_product = user['item_post']['product'];
            current_day = user['item_post']['day'];
            current_lineitemquantity = user['item_post']['lineitemquantity'];
            current_basecost = user['item_post']['basecost'];
            current_name = user['item_post']['name'];
            current_shippingCountry = user['item_post']['shippingCountry'];
            if (current_product in json_response) {
                //vd 'dress da co'
                array_days = json_response[current_product]
                //duyet tung ngay 1
                is_exist_day = false;
                for (let i_day = 0; i_day < array_days.length; i_day++) {
                    current_day_db = array_days[i_day];
                    //check ngay do co trong db chua
                    if (current_day === current_day_db['day']) {
                        //update basecost
                        current_day_db['basecost'] = parseInt(current_day_db['basecost']) + parseInt(current_lineitemquantity) * parseInt(current_basecost)
                        //update quantity
                        current_day_db['quantity'] = parseInt(current_day_db['quantity']) + parseInt(current_lineitemquantity)
                        //update array name
                        if (current_day_db["name"] !== current_name) {
                            //khac nhau thi add vao mang
                            current_day_db["name"].push(current_name)
                        } else {
                            //name giong nhau thi thoi
                        }
                        //update array shipping_us
                        if (current_shippingCountry === "US") {
                            //neu la us thi them vao
                            current_day_db["shipping_us"] = parseInt(current_day_db["shipping_us"]) + 1
                        } else {
                            //world wide thi bo qua
                        }
                        is_exist_day = true;
                        break;
                    }
                }
                if (!is_exist_day) {
                    //neu current_day trong ton tai trong array_days
                    new_day_db = {};
                    new_day_db['day'] = current_day
                    new_day_db['basecost'] = current_basecost * current_lineitemquantity
                    new_day_db['quantity'] = current_lineitemquantity
                    new_day_db['name'] = []
                    new_day_db['name'].push(current_name)
                    if (current_shippingCountry == "US") {
                        new_day_db['shipping_us'] = 1
                    } else {
                        new_day_db['shipping_us'] = 0
                    }
                    array_days.push(new_day_db)
                }
                json_response[current_product] = array_days

            } else {
                //1 type product moi, vd "shoes chua co"
                json_response[current_product] = []
                new_day_db = {};
                new_day_db['day'] = current_day
                new_day_db['basecost'] = current_basecost * current_lineitemquantity
                new_day_db['quantity'] = current_lineitemquantity
                new_day_db['name'] = []
                new_day_db['name'].push(current_name)
                if (current_shippingCountry == "US") {
                    new_day_db['shipping_us'] = 1
                } else {
                    new_day_db['shipping_us'] = 0
                }
                json_response[current_product].push(new_day_db)
            }
        }
        console.log(json_response)
        //=end=xu ly ra ket qua summary
        res.send(json_response);
    } catch (err) { }
})
router.put("/:id", async function (req, res) {
    let { id } = req.params;
    //get ra user co id nhu vay
    var user, user2;
    try {
        user = await userModel.findOne({ "item_post.id": id });
    } catch (err) {
        res.status(400).send("nothing user found");
        return;
    }
    user['item_post'] = req.body['item_post']
    try {
        user2 = await user.save()
    } catch (err) {
        res.send(err);
    }
    res.send(user2)
    


})
router.patch("/:id", async function (req, res) {
    let { id } = req.params;
    //get ra user co id nhu vay
    var user;
    try {
        user = await userModel.findOne({ "item_post.id": id });
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
    try {
        // user.fullname = req.body.fullname;
        // save updated user
        // user = await user.save()

        //cau lenh update (cho nay eo hieu sao post thi dc)
        var new_user = new userModel(user)
        new_user = await new_user.save()
        res.send(user)
    } catch (err) {
        res.send(err);
    }
})
router.delete("/:id", async function (req, res) {
    let { id } = req.params;
    //get ra user co id tuong uong
    var user;
    try {
        user = await userModel.findOne({ 'item_post.id': id });
    } catch (err) {
        res.status(400).send("nothing user found");
        return;
    }
    try {
        //xoa user bang mongoose
        user = await user.remove()
        res.send(user)
    } catch (err) {
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

    if (old_user) {
        res.send("id item exist!!"); return //ton tai id item => return, ko post
    }
    //vong lap post
    // for (let userPost of req.body) {
    try {
        var user = new userModel(req.body)
        user = await user.save()
        res.send(user)
    } catch (err) {
        res.send(err)
    }
})



module.exports = router;