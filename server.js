const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      path = require('path'),
      app = express();

mongoose.connect('mongodb://localhost/marvins');
mongoose.Promise = global.Promise;

var marvinSchema = new mongoose.Schema({
  name: {type: String, required:[true, "A name is required!"], minlength: [2, "Names must contain at least two characters!"]},
  location: {type: String, required:[true, "A location is required!"], minlength: [3, "Locations must contain at least three characters!"]},
  age: {type: Number, required:[true, "Age is required"]}
}, {timestamps: true})

// set the model in my database using the Schema
mongoose.model('Marvin', marvinSchema);
// get the model
const Marvin = mongoose.model('Marvin');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './bower_components')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  console.log("at slash route")

Marvin.find({} )
  .then((data)=>{
    console.log("Database found");
    res.render('index', {"users": data});
  })
  .catch((err)=>{
    console.log("ERROR finding users")
  })
})

app.get('/mongooses/new', function(req, res){
  console.log("Show the form to create new mongoose");
  res.render('create', {errors: null})
})

app.get('/mongooses/:id', function(req, res){
  console.log("at mongooses/:id, display info about one mongoose");
  res.render('oneMongoose')
})

app.post('/mongooses', function(req, res){
  console.log("creating a new mongoose", req.body);
  Marvin.create(req.body)
  .then((data)=>{
    console.log("successfully created!", data);
    res.redirect('/');
  })
  .catch((err)=>{
    let errors = [];
    for(var key in err.errors){
      errors.push(err.errors[key].message);
    }
    res.render('create', {errors: errors})
  })
})

app.get('/mongooses/edit/:id', function(req, res){
  Marvin.findOne({_id: req.params.id})
  .then((data)=>{
      res.render('edit',data)
  })
  .catch((err)=> {
    console.log("error found",err)
  })
})

app.post('/mongooses/:id', function(req, res){
  Marvin.update({_id:req.params.id},req.body, {runValidators: true})
  .then((data)=> {
    res.redirect('/');
  })
  .catch((err)=> {
    console.log("error found", err)
  })
})

app.post('/mongoose/destroy/:id', function(req, res){
  console.log("destroying");
  Marvin.remove({_id:req.params.id})
  .then((data)=> {
    res.redirect('/');
  })
  .catch((err)=>{
    console.log('Error', err)
  })
})


app.listen(8000, function(){
  console.log("listening on 8000");
})
