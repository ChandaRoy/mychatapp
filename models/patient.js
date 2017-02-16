var mongoose = require('mongoose'),
patientSchema = new mongoose.Schema({
  name: String,
  patientID:String,
  createdDate: Date,
  updatedDate: Date,
  age: String,
  sex: String,
  email:String,
  address:String,
  contact:String
});

patientSchema.statics.addPatient = function(patientDetails, callback) {
  console.log("before add",patientDetails);
  this.create({
    name: patientDetails.name,
    age: patientDetails.age,
    createdDate: (patientDetails.createdDate) ? (patientDetails.createdDate) : Date.now(),
    updatedDate: Date.now(),
    sex: patientDetails.sex,
    email: patientDetails.email,
    address:patientDetails.address,
    contact: patientDetails.contact,
  }, function(err, data) {
    console.log("in add patient",data);
    if (err) callback(err)
    else callback(data);
  });
}

patientSchema.statics.updatepatient = function(patientId, newpatientDetails, callback) {
  console.log("----------Inside updatepatient model");
  console.log("-" + patientId + "-");
  console.log(newpatientDetails);
  this.findOneAndUpdate({
    "_id": patientId
  }, {
    $set: {
      name: newpatientDetails.name,
      age: newpatientDetails.age,
      email: newpatientDetails.email,
      sex:newpatientDetails.sex,
      contact:newpatientDetails.contact,
      address:newpatientDetails.address
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
patientSchema.statics.getpatientDetails=function(patientId,callback){
console.log("model",patientId);
  this.find({
    '_id':patientId
  })
  .exec(function(err, doc) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, doc);
    }
  });
}


module.exports = mongoose.model('patient', patientSchema, 'Patients');;
