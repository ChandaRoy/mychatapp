var mongoose = require('mongoose'),
User = require('./models/user'),
LocalStrategy   = require('passport-local').Strategy,
bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			//console.log('deserializing user:',user.username);
			done(err, user);
		});
	});

	passport.use('local-login', new LocalStrategy({
		passReqToCallback : true,
		usernameField: 'email',
		passwordField: 'password'
	},
	function(req, email, password, done) {

		// check in mongo if a user with email exists or not
		User.findOne({ 'email' :  email },
		function(err, user) {
			console.log("In passport init",user);
			console.log(err);
			// In case of any error, return using the done method
			if (err)
			return done(err);
			// Email does not exist, log the error and redirect back
			if (!user){
				console.log('User Not Found with email '+email);
				return done(null, false);
			}
			// User exists but wrong password, log the error
			if (user.password !== password){
				console.log('Invalid Password');
				return done(null, false); // redirect back to login page
			}
			if(user.role!==req.body.role){
				console.log(req.body.role);
				console.log(user.role);
				console.log("no user with this role");
				return done(null, false);
			}
			else {
				// console.log("passing This: ");
				// console.log(user);

				return done(null,user);
			}

		});
	}
));

passport.use('sign-up', new LocalStrategy({
	passReqToCallback : true,// allows us to pass back the entire request to the callback
	usernameField: 'email',
	passwordField: 'password'
},

function(req, email, password, done) {
	// find a user in mongo with provided email
	User.findOne({ 'email' :  email }, function(err, user) {
		console.log("In Register now");
		// In case of any error, return using the done method
		if (err){
			console.log('Error in register: '+err);
			return done(err);
		}
		// already exists
		if (user) {
			console.log('User already exists:');
			return done(null, false);
		} else {
			// if there is no user, create the user
			var newUser = new User();

			// set the user's local credentials
			newUser.email = email;
			newUser.password = password;
			newUser.role=req.body.role;
			newUser.age=req.body.age,
			newUser.sex=req.body.sex,
			newUser.address=req.body.address,
			newUser.contact=req.body.contact,
			newUser.bloodGroup=req.body.bloodGroup

			if(req.body.firstName===undefined)
			{
				newUser.firstName = "";
			}
			else{
				newUser.firstName=req.body.firstName;
			}
			if(req.body.lastName===undefined)
			{
				newUser.lastName = "";
			}
			else{
				newUser.lastName=req.body.lastName;
			}
			console.log(req.body.firstName);
			// save the user
			newUser.save(function(err) {
				if (err){
					console.log('Error in Saving user: '+err);
					throw err;
				}
				console.log(newUser.email + ' Registration succesful');
				return done(null, newUser);
			});
		}
	});
})
);


var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.local.password);
};
// Generates hash using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

};
