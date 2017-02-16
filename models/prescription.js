var mongoose = require('mongoose'),
prescriptionSchema = new mongoose.Schema({
  patientId: String,
  illness:String,
  createdDate: Date,
  updatedDate: Date,
  treatment: String,
  doctorId: String,
  doctorName:String,
  doctorEmail:String,
  doctorContact:String
});

prescriptionSchema.statics.addprescription = function(prescription, callback) {
  console.log("before add",prescription);
  this.create({
    patientId: prescription.prescription.patientId,
    illness: prescription.prescription.illness,
    createdDate: (prescription.createdDate) ? (prescription.createdDate) : Date.now(),
    updatedDate: Date.now(),
    treatment: prescription.prescription.treatment,
    doctorId: prescription.prescription.doctorName,
    doctorEmail:prescription.prescription.doctorEmail,
    doctorContact: prescription.prescription.doctorContact,
  }, function(err, data) {
    console.log("in add prescription",data);
    if (err) callback(err)
    else callback(data);
  });
}

// prescriptionSchema.statics.updateprescription = function(prescriptionId, newprescription, callback) {
//   console.log("----------Inside updateprescription model");
//   console.log("-" + prescriptionId + "-");
//   console.log(newprescription);
//   this.findOneAndUpdate({
//     "_id": prescriptionId
//   }, {
//     $set: {
//       name: newprescription.name,
//       age: newprescription.age,
//       email: newprescription.email,
//       sex:newprescription.sex,
//       contact:newprescription.contact,
//       address:newprescription.address
//     }
//   }, {
//     upsert: true
//   })
//   .exec(function(err, doc) {
//     if (err) {
//       console.log(err);
//       callback(err, null);
//     } else {
//       callback(null, doc);
//     }
//   });
// }
prescriptionSchema.statics.getAllPrescriptions=function(patientId,callback){
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


module.exports = mongoose.model('prescription', prescriptionSchema, 'prescriptions');;
