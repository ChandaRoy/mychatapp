var mongoose = require('mongoose'),
userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  createdDate: Date,
  updatedDate: Date,
  password: String,
  email: String,
  role:String,
  age: String,
  sex: String,
  address:String,
  contact:String,
  bloodGroup:String,
  initials: String,
  photo: String
});

userSchema.statics.addUser = function(userDetails, callback) {
  this.create({
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    createdDate: (userDetails.createdDate) ? (userDetails.createdDate) : Date.now(),
    updatedDate: Date.now(),
    password: userDetails.password,
    email: userDetails.email,
    imageUrl: userDetails.imageUrl,
    role:userDetails.role,
    age: userDetails.age,
    sex: userDetails.sex,
    address:userDetails.address,
    contact:userDetails.contact,
    bloodGroup:userDetails.bloodGroup


  }, function(err, data) {
    if (err) callback(err)
    else callback(data);
  });
}
userSchema.statics.updateUser = function(userId, newUserDetails, callback) {
  console.log("----------Inside updateUser model");
  console.log("-" + userId + "-");
  console.log(newUserDetails);
  this.findOneAndUpdate({
    "_id": userId
  }, {
    $set: {
      firstName: newUserDetails.firstName,
      lastName: newUserDetails.lastName,
      email: newUserDetails.email,
      age: newUserDetails.age,
      sex: newUserDetails.sex,
      address:newUserDetails.address,
      contact:newUserDetails.contact,
      bloodGroup:newUserDetails.bloodGroup

    }
  }, {
    upsert: true
  })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, doc);
    }
  });
}




userSchema.statics.getUserEmail = function(email, callback) {
  return this.find({
    'email': RegExp(email)
  }).exec(function(err, data) {
    if (err) callback(err, null);
    else callback(null, data);
  });
}


userSchema.statics.getUserDetails=function(userId,callback){
console.log("model",userId);
  this.find({
    '_id':userId
  })
  .exec(function(err, doc) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, doc);
    }
  });
}

module.exports = mongoose.model('User', userSchema, 'Users');;
