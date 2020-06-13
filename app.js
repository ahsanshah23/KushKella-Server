//adding 3rd packages
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

//Connecting to database
const db = require('./util/database');

//initializing express
const app = express();
let server = app.listen(3006);

//adding routes

module.exports.getIO = function () {
  return io;
}

//iniliazing body-parser
app.use(bodyparser.urlencoded());

//using express static to add css via public folder
app.use(express.static(path.join(__dirname, 'public')));


//Routes to pages
app.use('/addform', (req, res) => {

  var totalincome = req.query.totalincome;
  var totalbusinessexpense = req.query.totalbusinessexpense;
  var totalmilesdriven = req.query.totalmilesdriven;
  var totaltaxespaid = req.query.totaltaxespaid;
  var FormID = req.query.FormID;
  var PhoneID = req.query.PhoneID;

  var totaltaxableincome = "";

  if (FormID == 1) {
    var temp = totalincome - totalbusinessexpense;

    var temp1 = temp - (2.1 * totalmilesdriven);

    if (temp1 >= 0 && temp1 <= 10000) {
      totaltaxableincome = temp1;
    }
    else if (temp1 > 10000 && temp1 <= 50000) {
      totaltaxableincome = temp1 - 1000;
    }
    else {
      totaltaxableincome = temp1 - (temp1 * 0.01);
    }
  }

  else if (FormID == 2) {

    if (totalincome >= 0 && totalincome <= 10000) {
      totaltaxableincome = totalincome;
    }
    else if (totalincome > 10000 && totalincome <= 50000) {
      totaltaxableincome = totalincome - 1000;
    }
    else {
      totaltaxableincome = totalincome - (totalincome * 0.02);
    }
  }

  db.execute("INSERT INTO user_forms (ID, FormID, PhoneID, totalincome, totalbusinessexpense,totalmilesdriven,totaltaxespaid, totaltaxableincome, 1040ID) VALUES ('','" + FormID + "','" + PhoneID + "','" + parseFloat(totalincome).toFixed(2) + "','" + parseFloat(totalbusinessexpense).toFixed(2) + "','" + parseFloat(totalmilesdriven).toFixed() + "','" + parseFloat(totaltaxespaid).toFixed() + "','" + parseFloat(totaltaxableincome).toFixed(2) + "', '0') ")
    .then(results => {
      // console.log("inserted")
      res.send("1")
    })
    .catch(err => {
      res.send("0")
      console.log(err)
    });

});

app.use('/formcount', (req, res) => {

  var FormID = req.query.FormID;
  var PhoneID = req.query.PhoneID;
  var ID1040 = req.query.ID1040;

  db.execute("Select count(*) as count from user_forms where PhoneID='" + PhoneID + "' && FormID='" + FormID + "' && 1040ID='" + ID1040 + "' ")
    .then(results => {
      res.send(results[0])
    })
    .catch(err => {
      // res.send("0")
      console.log(err)
    });

});

app.use('/formcount', (req, res) => {

  var FormID = req.query.FormID;
  var PhoneID = req.query.PhoneID;
  var ID1040 = req.query.ID1040;

  db.execute("Select count(*) as count from user_forms where PhoneID='" + PhoneID + "' && FormID='" + FormID + "' && 1040ID='" + ID1040 + "' ")
    .then(results => {
      res.send(results[0])
    })
    .catch(err => {
      // res.send("0")
      console.log(err)
    });

});

app.use('/add1044', (req, res) => {

  // var FormID = req.query.FormID;
  var PhoneID = req.query.PhoneID;


  db.execute("Select sum(totaltaxableincome) as tti, sum(totaltaxespaid) as ttp from user_forms where PhoneID='" + PhoneID + "' && 1040ID=0  ")
    .then(results => {
      var totaltaxtableincome = parseFloat(results[0][0].tti);
      var totaltaxespaid = parseFloat(results[0][0].ttp);

      var totaltaxliability = 0.00;

      if (totaltaxtableincome > 0 && totaltaxtableincome <= 100000) {
        totaltaxliability = totaltaxtableincome * 0.2
      }
      else {
        totaltaxliability = totaltaxtableincome * 0.28;
      }

      var taxdiffernce = totaltaxespaid - totaltaxliability;

      db.execute("insert into form_1040 values('', '" + PhoneID + "', '" + totaltaxtableincome + "', '" + totaltaxespaid + "','" + totaltaxliability + "','" + taxdiffernce + "')  ")
        .then(resultt => {
          db.execute(" update user_forms set 1040ID = (select id from form_1040 order by id desc limit 1) where PhoneID='" + PhoneID + "' && 1040ID=0 ")
            .then(resultt1 => {
              res.send("1");
              console.log("inserted 1040")
              // console.log(resultt1)
            })
            .catch(err => {
              res.send("0");
              console.log(err)
            });
        })
        .catch(err => {
          res.send("0");
          console.log(err)
        });

    })
    .catch(err => {
      res.send("0");
      console.log(err)
    });

});

app.use('/1040viewlist', (req, res) => {

  // var FormID = req.query.FormID;
  var PhoneID = req.query.PhoneID;

  db.execute("Select * from form_1040 where PhoneID='" + PhoneID + "' ")
    .then(results => {
      res.send(results[0])
    })
    .catch(err => {
      // res.send("0")
      console.log(err)
    });

});

app.use('/1040view', (req, res) => {

  var ID = req.query.ID;

  db.execute("Select * from form_1040 where id='" + ID + "' ")
    .then(results => {
      res.send(results[0])
    })
    .catch(err => {
      // res.send("0")
      console.log(err)
    });

});

app.use('/formviewlist', (req, res) => {

  var FormID = req.query.FormID;
  var PhoneID = req.query.PhoneID;
  var ID1040 = req.query.ID1040;

  db.execute("Select * from user_forms where PhoneID='" + PhoneID + "' && FormID='" + FormID + "' && 1040ID='" + ID1040 + "' ")
    .then(results => {
      res.send(results[0])
    })
    .catch(err => {
      // res.send("0")
      console.log(err)
    });

});

app.use('/formview', (req, res) => {

  var ID = req.query.ID;

  db.execute("Select * from user_forms where id='" + ID + "' ")
    .then(results => {
      res.send(results[0])
    })
    .catch(err => {
      // res.send("0")
      console.log(err)
    });

});



